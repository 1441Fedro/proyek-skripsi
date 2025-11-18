import React from 'react';
import { CSVLink } from 'react-csv'; // Dipertahankan dari versi lama

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
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800">
                    Hasil Analisis Kesamaan
                    {selectedDoc && `: Dokumen Utama ${selectedDoc}`}
                </h2>
                
                {results.length > 0 && (
                    <CSVLink 
                        data={csvData} 
                        headers={csvHeaders} 
                        filename={"similarity_report.csv"}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                        Export CSV
                    </CSVLink>
                )}
            </div>

            {/* Selector Dokumen */}
            {uploadedFileNames && uploadedFileNames.length > 0 && (
                <div className="mb-4">
                    <label className="text-gray-600 text-sm block mb-1">
                        Filter Hasil Berdasarkan Dokumen Utama:
                    </label>
                    <select
                        value={selectedDoc}
                        onChange={(e) => setSelectedDoc(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500"
                    >
                        <option value="">-- Tampilkan Semua Pasangan --</option>
                        {uploadedFileNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            )}


            {/* Tabel Utama */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">File 1</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">File 2</th>
                            <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">TF-IDF (%)</th>
                            <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">BERT (%)</th>
                            <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">N-Gram (%)</th>
                            <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Plagiat</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.map((r, index) => (
                            <tr key={index} className="hover:bg-blue-50">
                                <td className="p-3 break-words max-w-xs text-sm text-gray-900">{r.doc1}</td>
                                <td className="p-3 break-words max-w-xs text-sm text-gray-900">{r.doc2}</td>
                                <td className="p-3 text-center text-sm text-gray-600">{(r.tfidf * 100).toFixed(2)}%</td>
                                <td className="p-3 text-center text-sm text-gray-600">{(r.bert * 100).toFixed(2)}%</td>
                                <td className="p-3 text-center text-sm text-gray-600">{(r.ngram * 100).toFixed(2)}%</td>
                                <td
                                    className={`p-3 text-center text-sm font-medium ${
                                        r.plagiat === 'Ya' ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'
                                    }`}
                                >
                                {r.plagiat}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredResults.length === 0 && (
                <p className="text-gray-500 mt-4 text-center">Tidak ada hasil yang cocok dengan filter yang dipilih.</p>
            )}
        </div>
    );
};

export default AnalysisResultTable;