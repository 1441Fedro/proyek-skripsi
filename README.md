# 📚 Aplikasi Deteksi Plagiarisme Laporan Akhir Praktikum  
**Skripsi Informatika - Universitas Gunadarma**  
_NIM: 51414414 · Nama: Fedro Jatmika_

---

## 📌 Deskripsi Proyek

Repositori ini merupakan bagian dari penyusunan **Skripsi S1 Teknik Informatika** dengan judul:

> **“Aplikasi Plagiarisme untuk Deteksi Kesamaan Logika Program pada Laporan Akhir Praktikum Laboratorium Informatika dengan Metode BERT, TF-IDF, dan N-Gram”**

Aplikasi ini dirancang untuk membantu asisten laboratorium dalam mendeteksi indikasi **plagiarisme pada bagian logika laporan akhir praktikum** menggunakan pendekatan **Natural Language Processing (NLP)** modern.

---

## 🎯 Tujuan

- ✅ Mendeteksi kesamaan logika antar laporan akhir praktikum.
- ✅ Menganalisis dokumen menggunakan metode:
  - TF-IDF (Term Frequency-Inverse Document Frequency)
  - BERT (Bidirectional Encoder Representations from Transformers)
  - N-Gram
- ✅ Mempermudah proses penilaian laporan oleh asisten lab.
- ✅ Menyediakan antarmuka berbasis web untuk manajemen laporan dan analisis kemiripan.

---

## ⚙️ Teknologi yang Digunakan

### 🔧 Backend
- [FastAPI](https://fastapi.tiangolo.com/) – Framework backend modern dan cepat berbasis Python  
- [Transformers](https://huggingface.co/transformers/) – Untuk model BERT  
- Scikit-learn – Untuk TF-IDF dan N-Gram  
- PyMuPDF & python-docx – Ekstraksi teks dari PDF dan DOCX  
- Uvicorn – Server untuk menjalankan FastAPI  

### 🎨 Frontend
- [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) – Framework frontend cepat dan ringan  
- Tailwind CSS – Styling UI modern dan responsif  
- React Router, Axios, react-toastify – Navigasi, HTTP Request, dan notifikasi  

### 🛢️ Database
- PostgreSQL – Untuk data user & role  
- MongoDB – Menyimpan teks laporan yang sudah diekstraksi  

---

## 📁 Struktur Proyek

```
proyek-skripsi/
│
├── plagiarism-checker-backend/     # Backend FastAPI
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── utils/
│   │   └── main.py
│   └── requirements.txt
│
├── plagiarism-checker-frontend/    # Frontend React.js
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── routes/
│   │   └── App.jsx
│   └── package.json
│
├── plagiarism-checker-database/    # Struktur dan setup DB
│   ├── postgresql/
│   └── mongodb/
│
├── screenshots/                    # Gambar antarmuka (optional)
│   ├── upload.png
│   ├── result.png
│   └── users.png
│
├── README.md
└── LICENSE
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Clone Repo

```bash
git clone https://github.com/1441Fedro/proyek-skripsi.git
cd proyek-skripsi
```

### 2. Setup Backend

```bash
cd plagiarism-checker-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Setup Frontend

```bash
cd ../plagiarism-checker-frontend
npm install
npm run dev
```

### 4. Jalankan Database

Pastikan PostgreSQL dan MongoDB berjalan secara lokal.  
Cek ulang konfigurasi koneksi database pada file environment (.env atau config).

---

## 🧠 Fitur Utama

| Fitur               | Deskripsi                                                                 |
|---------------------|---------------------------------------------------------------------------|
| 📤 Upload Laporan   | Mendukung format `.zip`, `.rar`, `.pdf`, `.docx`                          |
| 🧠 Analisis Teks    | Menggunakan kombinasi TF-IDF, N-Gram, dan BERT                            |
| 🔐 Role-based Access| Sistem login dengan peran Admin dan Asisten                              |
| 📊 Skor Similarity  | Menampilkan hasil deteksi skor kemiripan antar laporan                   |
| 🧾 Riwayat & Metadata| Menyimpan nama laporan, tanggal upload, dan hasil ekstraksi logika       |
| 🧱 UI Responsif     | Antarmuka web modern, intuitif, dan mobile-friendly                       |

---

## 🌐 Akses Antarmuka

- 🧪 **Upload Laporan**: [http://localhost:5173/upload](http://localhost:5173/upload)  
- 📋 **Daftar User (Admin)**: [http://localhost:5173/admin/users](http://localhost:5173/admin/users)  
- 🔐 **Login**: [http://localhost:5173/login](http://localhost:5173/login)  

---

## 📸 Contoh Tampilan

> **Catatan**: Tambahkan gambar berikut ke folder `screenshots/` agar tampil di bawah ini.

| Upload Laporan             | Hasil Analisis              | Manajemen User             |
|----------------------------|-----------------------------|----------------------------|
| ![](screenshots/upload.png) | ![](screenshots/result.png) | ![](screenshots/users.png) |

---

## 🧑‍💻 Pengembang

**Fedro Jatmika**  
`51414414` – Teknik Informatika  
Universitas Gunadarma  
📧 fedrojatmika@student.gunadarma.ac.id  
🔗 [GitHub Profile](https://github.com/1441Fedro)

---

## 📄 Lisensi

Proyek ini berlisensi **MIT License** – Bebas digunakan untuk keperluan akademik, riset, dan pengembangan lebih lanjut.  
Silakan lihat file [`LICENSE`](./LICENSE) untuk informasi lengkap.

---

## ⭐️ Dukung Proyek Ini

Jika kamu merasa proyek ini bermanfaat:

- Beri ⭐️ pada repo ini
- Gunakan sebagai referensi untuk praktikum atau skripsi
- Kirim saran dan perbaikan melalui [Issues](https://github.com/1441Fedro/proyek-skripsi/issues)

> _“Plagiarisme bukan hanya menyalin, tapi juga menghilangkan peluang belajar.”_ — ✍️

---