import React, { useState } from 'react';
// ASUMSI: Modal diimpor dari lokasi yang sama
import Modal from './Modal'; 

const ReportTable = ({ reports }) => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    if (reports.length === 0) {
        return (
            <div className="text-center p-8 bg-white/80 rounded-xl shadow-lg text-gray-700">
                Tidak ada laporan yang ditemukan.
            </div>
        );
    }

    return (
        // Desain Card modern dengan shadow dan sudut membulat
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-100/80">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Nama Laporan</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Pengunggah</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Waktu/Tanggal Unggah</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">ID Batch</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {reports.map((r, i) => (
                            <tr 
                                key={i} 
                                // ✅ FUNGSI CLICK BARIS
                                onClick={() => handleRowClick(r)}
                                className="cursor-pointer hover:bg-purple-50 transition duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{r.file_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(r.uploaded_at).toLocaleString('id-ID')}
                                </td>
                                {/* ✅ KOLOM ID BATCH */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {r.batch_id || 'N/A'} {/* Asumsi ada field batch_id dari API */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ MODAL DETAIL LAPORAN (Pop-up) */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedReport && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-purple-700">Detail Laporan</h3>
                        <p className="text-base font-semibold text-gray-700">
                            Nama File: <span className="font-normal text-gray-900">{selectedReport.file_name}</span>
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200">
                            <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Teks yang Diekstrak:</h4>
                            <p className="whitespace-pre-wrap text-sm text-gray-800">{selectedReport.text || 'Teks tidak tersedia.'}</p>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReportTable;