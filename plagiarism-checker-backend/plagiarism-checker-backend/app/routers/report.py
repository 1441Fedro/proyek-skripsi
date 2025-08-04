import os, shutil, zipfile, patoolib, uuid, tempfile, hashlib
from typing import List
from pathlib import Path
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query, Body
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from bson import ObjectId
from app.database import SessionLocal, mongo_reports, mongo_analysis
from app.auth import get_current_user
from app.models.user import User
from app.utils.extractor import extract_logic_text
from app.services.similarity import (
    tfidf_cosine_similarity,
    bert_similarity,
    ngram_similarity,
    combined_score,
    average_score,
    detect_plagiarism_treshold,
    detect_plagiarism_voting,
    detect_plagiarism_average)

router = APIRouter(tags=["Reports"])

UPLOAD_FOLDER = "uploaded_reports"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_text_hash(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

@router.post("/upload")
async def upload_reports(
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    extracted_texts = []
    MAX_FILE_SIZE_MB = 20
    MAX_FILES = 50
    batch_id = str(uuid.uuid4())
    if len(files) > MAX_FILES:
        raise HTTPException(status_code=400, detail="Terlalu banyak file. Maksimal 10 file.")

    for file in files:
        file_ext = Path(file.filename).suffix.lower()
        file_id = str(uuid.uuid4())
        save_path = f"{UPLOAD_FOLDER}/{file_id}_{file.filename}"

        # Simpan file ke disk
        with open(save_path, "wb") as f:
            f.write(await file.read())

        if file_ext.lower() in [".zip", ".rar"]:
            extract_dir = f"{UPLOAD_FOLDER}/extracted_{file_id}"
            os.makedirs(extract_dir, exist_ok=True)

            try:
                if file_ext == ".zip":
                    with zipfile.ZipFile(save_path, "r") as zip_ref:
                        zip_ref.extractall(extract_dir)
                else:
                    patoolib.extract_archive(save_path, outdir=extract_dir)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Gagal ekstrak .rar: {e}")

            for root, _, filenames in os.walk(extract_dir):
                for fname in filenames:
                    full_path = os.path.join(root, fname)
                    inner_ext = Path(fname).suffix.lower()
                    if inner_ext not in [".pdf", ".docx"]:
                        continue  # Hanya proses file .pdf dan .docx
                    text = extract_logic_text(full_path)
                    if text:
                        text_hash = get_text_hash(text)
                        # # Cek apakah hash ini sudah pernah diupload
                        # existing = mongo_reports.find_one({"text_hash": text_hash})
                        # if existing:
                        #     continue  # Lewati file yang sudah identik
                        extracted_texts.append({"filename": fname, "logic_text": text, "text_hash": text_hash})
                        print(f"✅ Menyimpan hasil ekstraksi: {fname}")
                        mongo_reports.insert_one({
                            "file_name": fname,
                            "file_path": save_path,
                            "uploaded_at": datetime.utcnow(),
                            "extracted_text": text,
                            "text_hash": text_hash,
                            "batch_id": batch_id
                        })
        elif file_ext in [".pdf", ".docx"]:
            text = extract_logic_text(save_path)
            if text:
                text_hash = get_text_hash(text)
                # # Cek apakah hash ini sudah pernah diupload
                # existing = mongo_reports.find_one({"text_hash": text_hash})
                # if existing:
                #     continue  # Lewati file yang sudah identik
                extracted_texts.append({"filename": file.filename, "logic_text": text, "text_hash": text_hash})
                print(f"✅ Menyimpan hasil ekstraksi: {file.filename}")
                mongo_reports.insert_one({
                    "file_name": file.filename,
                    "file_path": save_path,
                    "uploaded_at": datetime.utcnow(),
                    "extracted_text": text,
                    "text_hash": text_hash,
                    "batch_id": batch_id
                })
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")

    print("📦 extracted_texts dikirim ke frontend:", extracted_texts)
    return {"message": "Files uploaded successfully", "batch_id": batch_id, "extracted": extracted_texts}

# 3. POST /analisis/run (trigger manual analisis dari frontend)
@router.post("/analisis/run")
def run_similarity_analysis(request: dict = Body(...)):
    # filenames = request.get("filenames", [])
    # if not filenames:
    #     print("❌ Tidak ada filename dikirim.")
    #     return {"message": "Daftar filename kosong. Tidak ada dokumen untuk dianalisis."}

    # hashes = request.get("text_hashes", [])
    # print(f"📥 Diterima text_hashes: {hashes}")  # DEBUG
    # if not hashes:
    #     return {"message": "Daftar dokumen kosong"}

    batch_id = request.get("batch_id")
    if not batch_id:
        return {"message": "Batch ID tidak ditemukan"}

    # docs = list(mongo_reports.find({"file_name": {"$in": filename}}, {"file_name": 1, "extracted_text": 1, "_id": 0}))
    # docs = list(mongo_reports.find({"file_name": {"$in": filenames}}))
    # docs = list(mongo_reports.find({"text_hash": {"$in": hashes}}))
    docs = list(mongo_reports.find({"batch_id": batch_id}))
    print(f"📄 Dokumen ditemukan: {[doc['file_name'] for doc in docs]}")  # DEBUG
    if not docs:
        return {"message": "Dokumen tidak ditemukan untuk batch ini."}

    texts = [doc.get("extracted_text", "") for doc in docs]
    names = [doc.get("file_name", f"Unknown_{i}") for i, doc in enumerate(docs)]

    # Analisis kesamaan
    tfidf = tfidf_cosine_similarity(texts)
    bert = bert_similarity(texts)
    ngram = ngram_similarity(texts)

    # Penentuan status plagiat berbasis treshold
    # result = combined_score(tfidf, bert, ngram)
    # plagiat = detect_plagiarism_treshold(result)

    # Penentuan status plagiat berbasis voting
    # plagiat = detect_plagiarism_voting(tfidf, bert, ngram)

    # Penentuan status plagiat berbasis voting
    result = average_score(tfidf, bert, ngram)
    plagiat = detect_plagiarism_average(result, threshold=0.7)
    # plagiat = detect_plagiarism_average(tfidf, bert, ngram)

    # Simpan hasil ke MongoDB
    # mongo_reports.delete_many({"type": "analysis_result"})
    mongo_analysis.insert_one({
        "type": "analysis-result",
        "batch_id": batch_id,
        "filenames": names,
        "tfidf": tfidf,
        "bert": bert,
        "ngram": ngram,
        "plagiat": plagiat,
        "created_at": datetime.utcnow()
    })

    # Susun pasangan hasil untuk dikembalikan langsung ke frontend
    pairs = []
    n = len(names)
    plag_dict = {(p[0], p[1]): p[3] for p in plagiat}
    for i in range(n):
        for j in range(i + 1, n):
            label = plag_dict.get((i, j), "Tidak")
            pairs.append({
                "doc1": names[i],
                "doc2": names[j],
                "tfidf": tfidf[i][j],
                "bert": bert[i][j],
                "ngram": ngram[i][j],
                "plagiat": label
            })

    return {
        "message": "Analisis kemiripan selesai",
        "batch_id": batch_id,
        "total_files": n,
        "pairs": pairs
    }

# @router.get("/download/{report_id}")
# async def download_report(report_id: str):
#     report = mongo_reports.find_one({"_id": ObjectId(report_id)})
#     if not report:
#         raise HTTPException(status_code=404, detail="Report not found")
#     return FileResponse(report["file_path"])

# # 1. GET /reports (hanya untuk admin)
# @router.get("/reports")
# def get_all_reports(current_user: User = Depends(get_current_user)):
#     if current_user.role != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can access this")

#     reports = list(mongo_reports.find({}))
#     result = []
#     for r in reports:
#         result.append({
#             "id": str(r["_id"]),
#             "file_name": r.get("file_name"),
#             "uploaded_at": r.get("uploaded_at"),
#             "extracted_text": r.get("extracted_text", "")
#         })
#     return result

# # 2. GET /reports/me (untuk user biasa)
# @router.get("/reports/me")
# def get_my_reports(current_user: User = Depends(get_current_user)):
#     reports = list(mongo_reports.find({"uploaded_by": current_user.username}))
#     result = []
#     for r in reports:
#         result.append({
#             "id": str(r["_id"]),
#             "file_name": r.get("file_name"),
#             "uploaded_at": r.get("uploaded_at"),
#             "extracted_text": r.get("extracted_text", "")
#         })
#     return result
# @router.post("/upload")
# async def upload_reports(files: List[UploadFile] = File(...)):
#     extracted_reports = []
#     uploaded_filenames = []  # ✅ UPDATED: list nama file baru

#     for file in files:
#         filename = file.filename

#         if filename.endswith(".zip") or filename.endswith(".rar"):
#             with tempfile.TemporaryDirectory() as tmpdirname:
#                 archive_path = os.path.join(tmpdirname, filename)
#                 with open(archive_path, "wb") as f:
#                     f.write(await file.read())

#                 extracted_dir = os.path.join(tmpdirname, "extracted")
#                 os.makedirs(extracted_dir, exist_ok=True)

#                 if filename.endswith(".zip"):
#                     with zipfile.ZipFile(archive_path, 'r') as zip_ref:
#                         zip_ref.extractall(extracted_dir)
#                 else:
#                     with rarfile.RarFile(archive_path, 'r') as rar_ref:
#                         rar_ref.extractall(extracted_dir)

#                 for root, _, extracted_files in os.walk(extracted_dir):
#                     for extracted_file in extracted_files:
#                         file_path = os.path.join(root, extracted_file)
#                         if extracted_file.endswith((".pdf", ".docx")):
#                             text = extract_logic_text(file_path)

#                             # ✅ UPDATED: Skip jika file sudah pernah diupload
#                             if mongo_reports.find_one({"file_name": extracted_file}):
#                                 continue

#                             uploaded_filenames.append(extracted_file)  # ✅ ditambahkan

#                             report_data = {
#                                 "file_name": extracted_file,
#                                 "text": text,
#                                 "upload_date": datetime.now()
#                             }
#                             mongo_reports.insert_one(report_data)
#                             extracted_reports.append(report_data)
#         else:
#             return {"error": "Hanya file ZIP atau RAR yang didukung"}

#     if not uploaded_filenames:
#         return {"message": "Semua file sudah pernah diupload sebelumnya", "uploaded_files": []}

#     return {
#         "message": f"{len(uploaded_filenames)} file baru berhasil diupload",
#         "uploaded_files": uploaded_filenames  # ✅ NEW: untuk frontend
#     }

# @router.post("/analisis/run")
# def run_similarity_analysis(file_names: List[str]):
#     # ✅ Hapus semua hasil analisis sebelumnya
#     mongo_analysis.delete_many({})

#     documents = list(mongo_reports.find({"file_name": {"$in": file_names}}))
#     if len(documents) < 2:
#         raise HTTPException(status_code=400, detail="Minimal dua file dibutuhkan untuk analisis.")

#     # ✅ Lanjutkan seperti biasa untuk TF-IDF, BERT, dan N-Gram
#     file_names = [doc["file_name"] for doc in documents]
#     texts = [doc["text"] for doc in documents]
#     tfidf = tfidf_cosine_similarity(texts)
#     bert = bert_similarity(texts)
#     ngram = ngram_similarity(texts)

#     for i in range(len(documents)):
#         for j in range(i + 1, len(documents)):
#             mongo_analysis.insert_one({
#                 "file_1": file_names[i],
#                 "file_2": file_names[j],
#                 "tfidf": tfidf[i][j],
#                 "bert": bert[i][j],
#                 "ngram": ngram[i][j],
#                 "date": datetime.now()
#             })
#     return {"message": "Analisis similarity berhasil dijalankan"}
