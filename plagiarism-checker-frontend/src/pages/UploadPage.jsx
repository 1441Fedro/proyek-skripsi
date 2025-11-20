import MainLayout from '../layouts/MainLayout';
import { useState, useEffect } from 'react';
import api from '../api/api';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import UploadDropzone from '../components/UploadDropzone'; 
import UploadedFilesTable from '../components/UploadedFilesTable'; 
import AnalysisResultTable from '../components/AnalysisResultTable'; 

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState([]);
    const [uploadedFileNames, setUploadedFileNames] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [batchId, setBatchId] = useState('');
    const [isUploaded, setIsUploaded] = useState(false); 
    const [isAnalyzed, setIsAnalyzed] = useState(false); 
    
    // const navigate = useNavigate();

    // Memuat hasil analisis terakhir (Hanya untuk display AnalysisResultTable)
    useEffect(() => {
        const storedResults = localStorage.getItem('lastAnalysisResult');
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setResults(parsedResults);

            const names = new Set();
            parsedResults.forEach(r => {
                names.add(r.doc1);
                names.add(r.doc2);
            });
            setUploadedFileNames(Array.from(names).sort());
            
            // Jika ada hasil, asumsikan analisis sebelumnya sudah selesai
            if (parsedResults.length > 0) {
                setIsAnalyzed(true);
            }
        }
    }, []);
    
    // ✅ Mengganti file yang ada & Reset status
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles); 
        setIsUploaded(false); // Reset status upload
        setIsAnalyzed(false); // Reset status analisis
    };

    // ✅ Mengganti file yang ada & Reset status
    const handleDrop = (e) => {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
        setIsUploaded(false); // Reset status upload
        setIsAnalyzed(false); // Reset status analisis
    };

    // Saat file dihapus dari antrian, hanya reset status jika files < 2
    const handleRemoveFile = (indexToRemove) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        toast.info(`File berhasil dihapus dari antrian.`);
        
        if (updatedFiles.length < 2) {
            setIsUploaded(false); 
            setIsAnalyzed(false);
        }
    };

    const handleUpload = async () => {
        // Pencegahan ganda
        if (isUploaded) {
            toast.warn("File sudah diunggah. Silakan RUN ANALISIS atau tambahkan file baru.");
            return;
        }
        
        if (files.length < 2) { 
            toast.warn("Minimal 2 file dibutuhkan untuk analisis. Unggah dibatalkan.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        // const access_token = localStorage.getItem('access_token'); 
        // if (!access_token) {
        //     toast.error("Anda tidak terautentikasi. Silakan login.");
        //     setIsUploading(false);
        //     return;
        // }

        try {
            const res = await api.post('/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': `Bearer ${access_token}`
                }
            });

            toast.success(res.data.message || `${res.data.uploaded_files.length} file berhasil diunggah.`);
            setIsUploaded(true);
            setBatchId(res.data.batch_id);
            setFiles([]); 
            
        } catch (err) {
            console.error("Upload error:", err);
            const errorMessage = err.response?.data?.detail || 'Gagal mengunggah file. Periksa koneksi atau format file.';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!isUploaded) {
            toast.warn("Harap UPLOAD file terlebih dahulu.");
            return;
        }
        
        if (isAnalyzed) { // Pencegahan ganda
            toast.warn("Analisis sudah selesai. Harap unggah file baru untuk analisis baru.");
            return;
        }

        if (!batchId) {
            toast.error("Batch ID tidak ditemukan. Silakan unggah file kembali.");
            return;
        }

        setIsAnalyzing(true);
        // const access_token = localStorage.getItem('access_token');
        // if (!access_token) {
        //     toast.error("Anda tidak terautentikasi. Silakan login.");
        //     setIsAnalyzing(false);
        //     return;
        // }
        try {
            const res = await api.post('/analisis/run', { batch_id: batchId }, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${access_token}`
            }
        });
            
            localStorage.setItem('lastAnalysisResult', JSON.stringify(res.data.pairs));
            
            toast.success("Analisis berhasil dijalankan! Mengarahkan ke halaman hasil.");
            
            // ✅ Kunci utama: Set isAnalyzed menjadi TRUE
            setIsAnalyzed(true);
            
            // Set state untuk tampilan hasil analisis di halaman ini
            const names = new Set();
            res.data.pairs.forEach(r => {
                names.add(r.doc1);
                names.add(r.doc2);
            });
            setUploadedFileNames(Array.from(names).sort());
            setResults(res.data.pairs);
            
            // Asumsi: Jika analisis berhasil, Anda tetap berada di halaman upload dan menampilkan hasil.
            // Jika Anda ingin pindah ke /result:
            // navigate('/result'); 

        } catch (err) {
            console.error("Analysis error:", err);
            const errorMessage = err.response?.data?.detail || 'Gagal menjalankan analisis.';
            toast.error(errorMessage);
        } finally {
            setIsAnalyzing(false);
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
                        <div className="lg:col-span-2">
                            <UploadDropzone
                                files={files}
                                isUploading={isUploading}
                                isAnalyzing={isAnalyzing}
                                isUploaded={isUploaded} 
                                isAnalyzed={isAnalyzed} // ✅ PASS STATE BARU
                                handleFileChange={handleFileChange}
                                handleDrop={handleDrop} 
                                handleUpload={handleUpload}
                                handleAnalyze={handleAnalyze}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <UploadedFilesTable
                                files={files}
                                handleRemoveFile={handleRemoveFile}
                            />
                        </div>
                    </div>

                    {/* Bagian Bawah: Tabel Hasil Analisis */}
                    {results.length > 0 && isAnalyzed && ( // Tampilkan jika sudah dianalisis
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