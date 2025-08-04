import csv
from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.database import mongo_reports
from app.services.similarity import tfidf_cosine_similarity, bert_similarity, ngram_similarity

router = APIRouter(prefix="/analisis", tags=["analisis"])

@router.get("/run")
def run_similarity_analysis():
    docs = list(mongo_reports.find({}, {"file_name": 1, "extracted_text": 1, "_id": 0}))
    filenames = [d.get("file_name", f"Unknown_{i}") for i, d in enumerate(docs)]
    texts = [d.get("extracted_text", f"Unknown_{i}") for i, d in enumerate(docs)]

    tfidf_result = tfidf_cosine_similarity(texts)
    bert_result = bert_similarity(texts)
    ngram_result = ngram_similarity(texts)

    # Simpan hasil ke MongoDB
    mongo_reports.delete_many({"type": "analysis_result"})
    mongo_reports.insert_one({
        "type": "analysis_result",
        "filenames": filenames,
        "tfidf": tfidf_result,
        "bert": bert_result,
        "ngram": ngram_result,
    })

    # Buat pairs agar langsung bisa digunakan frontend
    pairs = []
    n = len(filenames)
    for i in range(n):
        for j in range(i + 1, n):
            pairs.append({
                "doc1": filenames[i],
                "doc2": filenames[j],
                "tfidf": tfidf_result[i][j],
                "bert": bert_result[i][j],
                "ngram": ngram_result[i][j],
            })

    return {"message": "Analisis kemiripan selesai", 
            "total_files": len(filenames), 
            "pairs": pairs}

@router.get("/", include_in_schema=False)
@router.get("")
def get_high_similarity_pairs():
    result = mongo_reports.find_one({"type": "analysis_result"})
    if not result:
        return {"message": "No analysis result found"}

    pairs = []
    tfidf = result["tfidf"]
    bert = result["bert"]
    ngram = result["ngram"]
    filenames = result["filenames"]
    n = len(filenames)

    for i in range(n):
        for j in range(i + 1, n):
            pairs.append({
                "doc1": filenames[i],
                "doc2": filenames[j],
                "tfidf": tfidf[i][j],
                "bert": bert[i][j],
                "ngram": ngram[i][j]
            })
    return {"total_pairs": len(pairs), "pairs": pairs}

@router.get("/export-csv")
def export_similarity_to_csv():
    result = mongo_reports.find_one({"type": "analysis_result"})
    if not result:
        return {"message": "No analysis result found"}

    filepath = "similarity_report.csv"
    with open(filepath, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["File 1", "File 2", "TF-IDF", "BERT", "N-Gram"])
        filenames = result["filenames"]
        tfidf = result["tfidf"]
        bert = result["bert"]
        ngram = result["ngram"]
        n = len(filenames)

        for i in range(n):
            for j in range(i + 1, n):
                writer.writerow([
                    filenames[i], filenames[j],
                    round(tfidf[i][j], 3),
                    round(bert[i][j], 3),
                    round(ngram[i][j], 3)
                ])
    return FileResponse(filepath, filename="similarity_report.csv")

@router.get("/heatmap")
def get_heatmap_data():
    result = mongo_reports.find_one({"type": "analysis_result"})
    if not result:
        return {"message": "No analysis result found"}

    return {
        "labels": result["filenames"],
        "tfidf": result["tfidf"],
        "bert": result["bert"],
        "ngram": result["ngram"]
    }

from app.services.highlighter import find_common_ngrams

@router.get("/highlight")
def highlight_similar_ngrams(file1: str, file2: str):
    doc1 = mongo_reports.find_one({"file_name": file1})
    doc2 = mongo_reports.find_one({"file_name": file2})
    if not doc1 or not doc2:
        return {"message": "File not found"}

    common = find_common_ngrams(doc1["extracted_text"], doc2["extracted_text"])
    return {
        "file1": file1,
        "file2": file2,
        "common_ngrams": list(common),
        "count": len(common)
    }
