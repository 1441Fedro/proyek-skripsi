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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
                        
                        extracted_texts.append({"filename": fname, "logic_text": text, "text_hash": text_hash})
                        print(f"✅ Menyimpan hasil ekstraksi: {fname}")
                        mongo_reports.insert_one({
                            "file_name": fname,
                            "file_path": save_path,
                            "uploaded_at": datetime.utcnow(),
                            "extracted_text": text,
                            "text_hash": text_hash,
                            "batch_id": batch_id,
                            "uploaded_by": current_user.username
                        })
        elif file_ext in [".pdf", ".docx"]:
            text = extract_logic_text(save_path)
            if text:
                text_hash = get_text_hash(text)
                
                extracted_texts.append({"filename": file.filename, "logic_text": text, "text_hash": text_hash})
                print(f"✅ Menyimpan hasil ekstraksi: {file.filename}")
                mongo_reports.insert_one({
                    "file_name": file.filename,
                    "file_path": save_path,
                    "uploaded_at": datetime.utcnow(),
                    "extracted_text": text,
                    "text_hash": text_hash,
                    "batch_id": batch_id,
                    "uploaded_by": current_user.username
                })
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")

    print("📦 extracted_texts dikirim ke frontend:", extracted_texts)
    return {"message": "Files uploaded successfully", "batch_id": batch_id, "extracted": extracted_texts}

# 3. POST /analisis/run (trigger manual analisis dari frontend)
@router.post("/analisis/run")
def run_similarity_analysis(
    request: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    batch_id = request.get("batch_id")
    if not batch_id:
        return {"message": "Batch ID tidak ditemukan"}

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

    result = average_score(tfidf, bert, ngram)
    plagiat = detect_plagiarism_average(result, threshold=0.7)
    mongo_analysis.insert_one({
        "type": "analysis-result",
        "batch_id": batch_id,
        "filenames": names,
        "tfidf": tfidf,
        "bert": bert,
        "ngram": ngram,
        "plagiat": plagiat,
        "created_at": datetime.utcnow(),
        "analyzed_by": current_user.username
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

