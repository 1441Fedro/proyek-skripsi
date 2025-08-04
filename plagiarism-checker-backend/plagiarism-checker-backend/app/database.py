from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

# load_dotenv()
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

# PostgreSQL Setup
DATABASE_URL = os.getenv("POSTGRES_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
print("DATABASE_URL loaded:", DATABASE_URL)  # debug
if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan. Cek file .env dan load_dotenv.")

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client[MONGO_DB_NAME]
mongo_reports = mongo_db["reports"]  # Koleksi untuk menyimpan laporan
mongo_analysis = mongo_db["analysis-result"] # Koleksi untuk menyimpan hasil analisis laporan