import MainLayout from '../layouts/MainLayout';
import { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ASUMSI: Komponen sudah diimpor dari lokasi yang benar (misalnya, '../components')
// Silakan ganti path ini sesuai struktur folder Anda
import UploadDropzone from '../components/UploadDropzone'; 
import UploadedFilesTable from '../components/UploadedFilesTable'; 
import AnalysisResultTable from '../components/AnalysisResultTable'; // Komponen baru

const UploadPage = () => {
    // STATE - Dipertahankan dari versi UploadPage.jsx lama
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState([]);
    const [uploadedFileNames, setUploadedFileNames] = useState([]); // State untuk filter
    const [selectedDoc, setSelectedDoc] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const navigate = useNavigate();

    // useEffect untuk memuat hasil analisis terakhir saat halaman dimuat (dari versi lama)
    useEffect(() => {
        const storedResults = localStorage.getItem('lastAnalysisResult');
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setResults(parsedResults);

            // Ekstrak daftar nama file unik untuk filter
            const names = new Set();
            parsedResults.forEach(r => {
                names.add(r.doc1);
                names.add(r.doc2);
            });
            setUploadedFileNames(Array.from(names).sort());
        }
    }, []);

    // HANDLERS
    
    // Fungsi untuk menambah file dari input biasa
    const handleFileChange = (e) => {
        // const newFiles = Array.from(e.target.files).filter(file => 
        //     !files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)
        // );
        // setFiles(prev => [...prev, ...newFiles]);
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles); 
        setIsUploaded(false); // Reset status upload
    };

    // Handler untuk menerima file dari drag and drop
    const handleDrop = (e) => {
        // e.preventDefault() sudah dipanggil di UploadDropzone.jsx
        // const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
        //     !files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)
        // );
        // setFiles(prev => [...prev, ...droppedFiles]);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
        setIsUploaded(false); // Reset status upload
    };

    // Fungsi untuk menghapus file dari daftar
    const handleRemoveFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
        toast.info(`File berhasil dihapus dari antrian.`);
    };

    // Handler untuk tombol Upload (Sesuai dengan report.py endpoint /upload)
    const handleUpload = async () => {
        if (files.length === 0) return;

        if (isUploaded) {
            toast.warn("File sudah diunggah. Silakan RUN ANALISIS atau tambahkan file baru.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            // Memanggil endpoint /upload 
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(res.data.message || `${res.data.uploaded_files.length} file berhasil diunggah.`);
            // setFiles([]); // Kosongkan daftar setelah upload berhasil
            if (files.length >= 2) { // Pastikan minimal 2 file terunggah
                setIsUploaded(true);
            }

        } catch (err) {
            console.error("Upload error:", err);
            const errorMessage = err.response?.data?.detail || 'Gagal mengunggah file. Periksa koneksi atau format file.';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Handler untuk tombol Analisis (Sesuai dengan plagiarism.py endpoint /analisis/run)
    const handleAnalyze = async () => {
        if (!isUploaded) {
            toast.warn("Harap UPLOAD file terlebih dahulu sebelum menjalankan analisis.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const res = await api.get('/analisis/run');
            
            localStorage.setItem('lastAnalysisResult', JSON.stringify(res.data.pairs));
            
            toast.success("Analisis berhasil dijalankan! Mengarahkan ke halaman hasil.");
            navigate('/result'); 

        } catch (err) {
            console.error("Analysis error:", err);
            const errorMessage = err.response?.data?.detail || 'Gagal menjalankan analisis.';
            toast.error(errorMessage);
        } finally {
            setIsAnalyzing(false);
            setIsUploaded(false);
            setFiles([]); 
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-500 p-8">
            <MainLayout>
                <div className="max-w-6xl mx-auto py-8">
                    <h1 className="text-3xl font-extrabold mb-8 text-white">
                        <span className="bg-white text-transparent bg-clip-text">Halaman Unggah</span> Dokumen
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Kolom Kiri: Kotak Upload */}
                        <div className="lg:col-span-2">
                            <UploadDropzone
                                files={files}
                                isUploading={isUploading}
                                isAnalyzing={isAnalyzing}
                                handleFileChange={handleFileChange}
                                handleDrop={handleDrop} 
                                handleUpload={handleUpload}
                                handleAnalyze={handleAnalyze}
                            />
                        </div>

                        {/* Kolom Kanan: Daftar File */}
                        <div className="lg:col-span-1">
                            <UploadedFilesTable
                                files={files}
                                handleRemoveFile={handleRemoveFile}
                            />
                        </div>
                    </div>

                    {/* Bagian Bawah: Tabel Hasil Analisis */}
                    {results.length > 0 && (
                        <AnalysisResultTable
                            results={results}
                            uploadedFileNames={uploadedFileNames}
                            selectedDoc={selectedDoc}
                            setSelectedDoc={setSelectedDoc}
                        />
                    )}
                </div>
            </MainLayout>
        </div>
    );
};

export default UploadPage;