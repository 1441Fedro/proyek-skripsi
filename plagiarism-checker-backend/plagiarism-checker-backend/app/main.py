from fastapi import FastAPI
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db  # sesuaikan path modulmu
from app.routers import auth, report, user, plagiarism
from app.models.user import User
from app.schemas.user import UserCreate
from app.auth import get_password_hash  # sesuaikan dengan fungsi hash yang kamu pakai 

app = FastAPI(title="Plagiarism Checker API")

@app.get("/")
def root():
    return {"message": "Plagiarism Checker API is running"}

@app.post("/create-admin")
def create_admin(db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == "admin@example.com").first()
    if existing:
        return {"message": "Admin already exists"}
    
    admin = User(
        name="admin",
        email="admin@iflab.com",
        hashed_password=get_password_hash("Admin1234@"),
        role="admin"
    )
    db.add(admin)
    db.commit()
    return {"message": "Admin created"}

# Ganti ini sesuai alamat frontend kamu
origins = [
    "http://localhost:5173",  # jika pakai Vite
    "http://127.0.0.1:5173",  # jika pakai IP
    # tambahkan domain produksi jika ada nanti
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],  # atau ["*"] untuk semua origin (tidak disarankan untuk produksi)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(report.router)
app.include_router(user.router)
app.include_router(plagiarism.router)
