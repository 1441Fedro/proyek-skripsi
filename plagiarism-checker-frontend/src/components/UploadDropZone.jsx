import React from 'react';

const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M18.75 9h-13.5C4.695 9 3 10.695 3 12.75v3.45a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25v-3.45C21 10.695 19.305 9 17.25 9H14.25" />
    </svg>
);

const UploadDropzone = ({ files, isUploading, isAnalyzing, isUploaded, handleFileChange, handleDrop, handleUpload, handleAnalyze }) => {
    
    const isReadyToAnalyze = files.length >= 2;

    const internalHandleDragOver = (e) => {
        e.preventDefault(); 
    };

    const internalHandleDrop = (e) => {
        e.preventDefault(); // Mencegah browser membuka file
        if (handleDrop) {
            handleDrop(e); // Panggil handler dari parent untuk memproses file
        }
    };

    // Logika kelas untuk tombol UPLOAD
    const uploadButtonClass = `flex-1 py-3 px-6 rounded-xl font-bold transition-transform transform ${
        // Kondisi AKTIF: Ada file, tidak sedang loading, dan belum diupload
        files.length > 0 && !isUploading && !isAnalyzing && !isUploaded
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:scale-[1.01]'
            // Kondisi NON-AKTIF: Default style (abu-abu)
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`;

    // Logika kelas untuk tombol RUN ANALISIS
    const analyzeButtonClass = `flex-1 py-3 px-6 rounded-xl font-bold transition-transform transform ${
        // Kondisi AKTIF: Sudah diupload, dan tidak sedang loading
        isUploaded && !isAnalyzing && !isUploading
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:scale-[1.01]'
            // Kondisi NON-AKTIF: Default style (abu-abu)
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`;

    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">Unggah Laporan</h2>
            
            {/* Kotak Drag and Drop */}
            <div
                onDragOver={internalHandleDragOver} 
                onDrop={internalHandleDrop}
                onClick={() => document.getElementById('file-input').click()}
                className="flex flex-col items-center justify-center h-48 border-4 border-dashed border-yellow-500 rounded-xl cursor-pointer 
                        text-yellow-100 hover:bg-slate-800 transition duration-300 p-6"
            >
                <input
                    type="file"
                    id="file-input"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.zip,.rar"
                />
                <CloudUploadIcon />
                <p className="mt-3 text-lg font-medium">Seret & Lepas File di Sini</p>
                <p className="text-sm">atau klik untuk memilih file. (PDF, DOCX, ZIP, RAR)</p>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isUploading || isAnalyzing || isUploaded}
                    // className={`flex-1 py-3 px-6 rounded-xl font-bold transition-transform transform ${
                    //     files.length > 0 && !isUploading && !isAnalyzing
                    //         ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:scale-[1.01]'
                    //         : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    // }`}
                    className={uploadButtonClass}
                >
                    {isUploading ? 'Mengunggah...' : `UPLOAD (${files.length} File)`}
                </button>

                <button
                    onClick={handleAnalyze}
                    disabled={!isUploaded || isAnalyzing || isUploading}
                    // className={`flex-1 py-3 px-6 rounded-xl font-bold transition-transform transform ${
                    //     isReadyToAnalyze && !isAnalyzing && !isUploading
                    //         ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:scale-[1.01]'
                    //         : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    // }`}
                    className={analyzeButtonClass}
                >
                    {isAnalyzing ? 'Menganalisis...' : 'RUN ANALISIS'}
                </button>
            </div>
            {!isUploaded && !isReadyToAnalyze && (
                <p className="mt-3 text-center text-sm text-red-400">
                    *Minimal 2 file dibutuhkan untuk menjalankan analisis.
                </p>
            )}
        </div>
    );
};

export default UploadDropzone;