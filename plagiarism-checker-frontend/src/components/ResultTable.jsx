import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

// Ikon Panah untuk Sorting
const ArrowIcon = ({ direction, isActive }) => {
    const baseClass = `w-3 h-3 ml-1 transition-transform duration-150 ${isActive ? 'opacity-100' : 'opacity-30'}`;
    
    if (direction === 'asc') {
        return (
            <svg className={`${baseClass} transform rotate-180`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.47a.75.75 0 011.08 0l4.25 4.47a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
            </svg>
        );
    }
    
    if (direction === 'desc') {
        return (
            <svg className={baseClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.47a.75.75 0 011.08 0l4.25 4.47a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
            </svg>
        );
    }
    
    return (
        <svg className={`${baseClass}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.168l3.71-3.798a.75.75 0 111.08 1.04l-4.25 4.47a.75.75 0 01-1.08 0l-4.25-4.47a.75.75 0 01.02-1.06z" />
        </svg>
    );
};

const ResultTable = ({ results, handleSort, sortKey, sortOrder }) => {
    // State Jumlah baris yang ditampilkan
    const [displayLimit, setDisplayLimit] = useState(10); 
    const MAX_ROWS = 40;
    const MIN_ROWS = 5;
    
    // ✅ Perhitungan Tinggi Scroll Dinamis
    // Estimasi 55px per baris untuk tinggi baris yang konsisten
    const scrollableHeight = `${displayLimit * 55 + 10}px`; 

    const headerMap = [
        { label: "File 1", key: "doc1", align: "left" },
        { label: "File 2", key: "doc2", align: "left" },
        { label: "TF-IDF (%)", key: "tfidf", align: "center" },
        { label: "BERT (%)", key: "bert", align: "center" },
        { label: "N-Gram (%)", key: "ngram", align: "center" },
        { label: "Plagiat", key: "plagiat", align: "center" },
    ];
    
    // Header dan Data CSV
    const csvHeaders = [
        { label: "File 1", key: "doc1" },
        { label: "File 2", key: "doc2" },
        { label: "TF-IDF (%)", key: "tfidf_percent" },
        { label: "BERT (%)", key: "bert_percent" },
        { label: "N-Gram (%)", key: "ngram_percent" },
        { label: "Plagiat", key: "plagiat" },
    ];

    const csvData = results.map(r => ({
        ...r,
        tfidf_percent: (r.tfidf * 100).toFixed(2) + '%',
        bert_percent: (r.bert * 100).toFixed(2) + '%',
        ngram_percent: (r.ngram * 100).toFixed(2) + '%',
    }));

    const getArrowIcon = (key) => {
        if (sortKey !== key) {
            return <ArrowIcon direction="asc" isActive={false} />;
        }
        if (sortOrder === 'asc') {
            return <ArrowIcon direction="asc" isActive={true} />;
        }
        if (sortOrder === 'desc') {
            return <ArrowIcon direction="desc" isActive={true} />;
        }
        return <ArrowIcon direction="asc" isActive={false} />;
    };

    const handleLimitChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < MIN_ROWS) {
            value = MIN_ROWS;
        } else if (value > MAX_ROWS) {
            value = MAX_ROWS;
        }
        setDisplayLimit(value);
    };


    return (
        <div className="bg-white rounded-xl shadow-2xl p-6">
            
            {/* Header: Judul, Limit, dan Export */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-bold text-gray-800">Detail Hasil Analisis Kesamaan ({results.length} Pasangan)</h2>
                
                <div className="flex space-x-4 items-center">
                    {/* Input Limit Baris */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="row-limit" className="text-sm font-medium text-gray-700">Tampilkan:</label>
                        <input
                            id="row-limit"
                            type="number"
                            value={displayLimit}
                            onChange={handleLimitChange}
                            min={MIN_ROWS}
                            max={MAX_ROWS}
                            className="w-16 p-1 border border-gray-300 rounded-md text-sm text-center focus:ring-purple-500 focus:border-purple-500"
                        />
                        <span className="text-sm text-gray-600">baris</span>
                    </div>

                    {/* Tombol Export */}
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={"plagiarism_analysis_report.csv"}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-150 font-medium shadow-md text-sm"
                    >
                        ⬇️ Export CSV
                    </CSVLink>
                </div>
            </div>

            {/* Tabel Hasil */}
            <div className="overflow-x-auto">
                {/* ✅ Kontainer Scroll dengan maxHeight dinamis */}
                <div 
                    style={{ maxHeight: scrollableHeight }} 
                    className="overflow-y-auto border border-gray-200 rounded-lg"
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Header: Sticky top-0 agar tetap terlihat saat scroll */}
                        <thead className="bg-gray-800 sticky top-0 z-10 shadow-md"> 
                            <tr>
                                {headerMap.map((header) => (
                                    <th 
                                        key={header.key}
                                        onClick={() => handleSort(header.key)}
                                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white cursor-pointer select-none transition-colors duration-150 hover:bg-gray-700/80
                                            ${header.align === 'left' ? 'text-left' : 'text-center'}`
                                        }
                                    >
                                        <div className={`flex items-center ${header.align === 'left' ? 'justify-start' : 'justify-center'}`}>
                                            <span>{header.label}</span>
                                            {getArrowIcon(header.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {/* ✅ Mapping SEMUA HASIL (results) - Scroll akan diterapkan oleh container div */}
                            {results.map((r, index) => {
                                const isPlagiat = r.plagiat === 'Ya';
                                
                                const rowClasses = isPlagiat
                                    ? 'transition-colors duration-150 hover:bg-red-50' // Hover Merah
                                    : 'transition-colors duration-150 hover:bg-green-50'; // Hover Hijau

                                const plagiatCellClasses = isPlagiat
                                    ? 'text-red-600 font-bold' // Warna teks merah
                                    : 'text-green-600 font-bold'; // Warna teks hijau

                                return (
                                    <tr key={index} className={rowClasses}>
                                        <td className="p-4 break-words max-w-xs text-sm text-gray-900">{r.doc1}</td>
                                        <td className="p-4 break-words max-w-xs text-sm text-gray-900">{r.doc2}</td>
                                        <td className="p-4 text-center text-sm text-gray-700">{(r.tfidf * 100).toFixed(2)}%</td>
                                        <td className="p-4 text-center text-sm text-gray-700">{(r.bert * 100).toFixed(2)}%</td>
                                        <td className="p-4 text-center text-sm text-gray-700">{(r.ngram * 100).toFixed(2)}%</td>
                                        <td
                                            className={`p-4 text-center text-sm ${plagiatCellClasses}`}
                                        >
                                            {r.plagiat}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {results.length === 0 && (
                <p className="text-gray-500 mt-4 text-center">Tidak ada hasil analisis yang ditemukan.</p>
            )}
        </div>
    );
};

export default ResultTable;