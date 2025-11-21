import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout';
import ReportTable from '../components/ReportTable'; 

const API_URL = 'http://localhost:8000'; // Sesuaikan URL API

const ReportListPage = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token');

    const fetchReports = async () => {
        setIsLoading(true);

        // Perbaikan: Cek token sebelum request
        if (!token) { 
            console.error('Token otentikasi tidak ditemukan.');
            toast.error('Anda harus login ulang. Token tidak ditemukan.');
            // Opsi: Redirect ke halaman login jika token hilang di tengah sesi
            // navigate('/'); 
            setIsLoading(false);
            return; 
        }

        try {
            const res = await axios.get(`${API_URL}/uploaded-reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data); 
        } catch (err) {
            // Perbaikan: Tangani error 401 dengan lebih spesifik
        if (err.response && err.response.status === 401) {
            toast.error('Sesi berakhir atau otentikasi gagal. Silakan login ulang.');
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
            localStorage.removeItem('role')
            localStorage.removeItem('lastAnalysisResult')
            localStorage.removeItem('lastBatchId')
            // Redirect ke halaman login
            navigate('/'); 
        }
        console.error('Gagal mengambil laporan:', err.response?.data || err.message);
            console.error('Gagal mengambil laporan:', err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // ✅ DESAIN MODERN: Background gradient biru langit ke ungu muda cerah
        // from-blue-300 (kanan atas) to-purple-400 (kiri bawah)
        <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-400 p-8">
            <MainLayout>
                <div className="p-10 space-y-8">
                    {/* Judul Halaman dengan warna kontras */}
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Daftar Laporan Terunggah</h1>
                    
                    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Semua Laporan</h2>
                        
                        {isLoading ? (
                            <div className="text-center p-6 text-xl text-gray-800">Memuat data laporan...</div>
                        ) : (
                            // ✅ Render komponen tabel yang telah dimodularisasi
                            <ReportTable reports={reports} /> 
                        )}
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default ReportListPage;