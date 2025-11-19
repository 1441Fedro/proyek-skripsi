import React from 'react';
import { CSVLink } from 'react-csv';

const AnalysisResultTable = ({ results, uploadedFileNames, selectedDoc, setSelectedDoc }) => {
    
    // Header CSV
    const csvHeaders = [
        { label: "File 1", key: "doc1" },
        { label: "File 2", key: "doc2" },
        { label: "TF-IDF (%)", key: "tfidf_percent" },
        { label: "BERT (%)", key: "bert_percent" },
        { label: "N-Gram (%)", key: "ngram_percent" },
        { label: "Plagiat", key: "plagiat" },
    ];

    // Format data untuk CSV (membutuhkan konversi nilai float ke persentase)
    const csvData = results.map(r => ({
        ...r,
        tfidf_percent: (r.tfidf * 100).toFixed(2) + '%',
        bert_percent: (r.bert * 100).toFixed(2) + '%',
        ngram_percent: (r.ngram * 100).toFixed(2) + '%',
    }));

    // Filter hasil berdasarkan dokumen yang dipilih
    const filteredResults = selectedDoc 
        ? results.filter(r => r.doc1 === selectedDoc || r.doc2 === selectedDoc) 
        : results;

    return (
        // ✅ 1. Modifikasi Desain Kotak (Mirip UploadDropzone)
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 mt-8 border-t-4 border-purple-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-300">Hasil Analisis Kesamaan Dokumen ({filteredResults.length} Pasangan)</h2>
                
                {/* Export CSV Button */}
                <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={"plagiarism_analysis_report.csv"}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 font-medium"
                >
                    ⬇️ Export ke CSV
                </CSVLink>
            </div>

            {/* Filter Dropdown */}
            <div className="mb-4">
                <label htmlFor="doc-filter" className="text-white mr-3 font-medium">Filter Berdasarkan Dokumen:</label>
                <select
                    id="doc-filter"
                    value={selectedDoc}
                    onChange={(e) => setSelectedDoc(e.target.value)}
                    className="p-2 border rounded-lg bg-white text-gray-800"
                >
                    <option value="">Semua Dokumen</option>
                    {uploadedFileNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                {selectedDoc && (
                    <button
                        onClick={() => setSelectedDoc('')}
                        className="ml-3 text-sm text-red-400 hover:text-red-500"
                    >
                        Hapus Filter
                    </button>
                )}
            </div>

            {/* Tabel Hasil */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full divide-y divide-gray-700 bg-white text-gray-900">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider">File 1</th>
                            <th className="px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider">File 2</th>
                            <th className="px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider">TF-IDF (%)</th>
                            <th className="px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider">BERT (%)</th>
                            <th className="px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider">N-Gram (%)</th>
                            <th className="px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider">Plagiat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredResults.map((r, index) => {
                            // Tentukan kelas CSS berdasarkan nilai 'plagiat'
                            const isPlagiat = r.plagiat === 'Ya';
                            
                            // ✅ 2. Tentukan kelas warna baris untuk normal dan hover
                            const rowClasses = isPlagiat
                                ? 'bg-red-50 hover:bg-red-100' // Merah Muda untuk Plagiat
                                : 'bg-green-50 hover:bg-green-100'; // Hijau Muda untuk Tidak Plagiat

                            const plagiatCellClasses = isPlagiat
                                ? 'bg-red-100 text-red-700' // Merah untuk Plagiat
                                : 'bg-green-50 text-green-700'; // Hijau untuk Tidak Plagiat

                            return (
                                <tr key={index} className={rowClasses}>
                                    <td className="p-3 break-words max-w-xs text-sm text-gray-900">{r.doc1}</td>
                                    <td className="p-3 break-words max-w-xs text-sm text-gray-900">{r.doc2}</td>
                                    <td className="p-3 text-center text-sm text-gray-600">{(r.tfidf * 100).toFixed(2)}%</td>
                                    <td className="p-3 text-center text-sm text-gray-600">{(r.bert * 100).toFixed(2)}%</td>
                                    <td className="p-3 text-center text-sm text-gray-600">{(r.ngram * 100).toFixed(2)}%</td>
                                    <td
                                        className={`p-3 text-center text-sm font-medium ${plagiatCellClasses}`}
                                    >
                                        {r.plagiat}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredResults.length === 0 && (
                <p className="text-gray-400 mt-4 text-center">Tidak ada hasil yang cocok dengan filter yang dipilih.</p>
            )}
        </div>
    );
};

export default AnalysisResultTable;