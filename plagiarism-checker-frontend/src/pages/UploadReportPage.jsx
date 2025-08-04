import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import MainLayout from '../layouts/MainLayout';

const UploadReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loadingReportId, setLoadingReportId] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
        try {
            const res = await api.get('/laporan');
            setReports(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data laporan');
            console.error(error);
        }
        };
        fetchReports();
    }, []);

    const handleAnalyze = async (reportId) => {
        setLoadingReportId(reportId);
        try {
        await api.post(`/laporan/analyze/${reportId}`);
        toast.success('Analisis berhasil dijalankan');
        } catch (error) {
        toast.error('Gagal menjalankan analisis');
        console.error(error);
        } finally {
        setLoadingReportId(null);
        }
    };

    return (
        <MainLayout>
            <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Daftar Laporan yang Telah Diupload</h2>
            {reports.length === 0 ? (
                <p className="text-gray-500">Belum ada laporan yang diupload.</p>
            ) : (
                <div className="space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="p-4 bg-white rounded shadow">
                    <p><strong>Nama File:</strong> {report.file_name}</p>
                    <p><strong>Tanggal Upload:</strong> {new Date(report.uploaded_at).toLocaleString()}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                        <strong>Isi Ekstraksi:</strong><br />{report.extracted_text?.slice(0, 500) || 'Tidak tersedia'}
                    </p>
                    <button
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        onClick={() => handleAnalyze(report.id)}
                        disabled={loadingReportId === report.id}
                    >
                        {loadingReportId === report.id ? <ClipLoader size={20} color="#fff" /> : 'Analisis Laporan Ini'}
                    </button>
                    </div>
                ))}
                </div>
            )}
            </div>
        </MainLayout>
    );
};

export default UploadReportPage;
