import React from 'react';

const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-yellow-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5M18.75 9h-13.5C4.695 9 3 10.695 3 12.75v3.45a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25v-3.45C21 10.695 19.305 9 17.25 9H14.25" />
    </svg>
);

// ✅ Terima isAnalyzed
const UploadDropzone = ({ files, isUploading, isAnalyzing, isUploaded, isAnalyzed, handleFileChange, handleDrop, handleUpload, handleAnalyze }) => {
    
    // Syarat minimum tetap 2 file
    const isReadyToUpload = files.length >= 2; 

    const internalHandleDragOver = (e) => {
        e.preventDefault(); 
    };

    const internalHandleDrop = (e) => {
        e.preventDefault();
        if (!isUploaded) { // Hanya izinkan drop jika belum di-upload
            handleDrop(e);
        }
    };
    
    // Logika kelas untuk tombol UPLOAD
    // AKTIF: ReadyToUpload (>=2 file) AND NOT isUploaded
    const uploadButtonClass = `flex-1 py-3 px-6 rounded-xl font-bold transition-transform transform ${
        isReadyToUpload && !isUploading && !isAnalyzing && !isUploaded
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:scale-[1.01]'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`;

    // Logika kelas untuk tombol RUN ANALISIS
    // AKTIF: isUploaded AND NOT isAnalyzing AND NOT isAnalyzed
    const analyzeButtonClass = `flex-1 py-3 px-6 rounded-xl font-bold transition-transform transform ${
        isUploaded && !isAnalyzing && !isUploading && !isAnalyzed
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:scale-[1.01]'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`;

    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">Unggah Laporan</h2>
            
            <div
                onDragOver={internalHandleDragOver} 
                onDrop={internalHandleDrop}
                onClick={() => { if (!isUploaded) document.getElementById('file-input').click() }} // ✅ Hanya klik jika belum diupload
                className={`flex flex-col items-center justify-center h-48 border-4 border-dashed rounded-xl p-6 transition duration-300 
                            ${isUploaded || isAnalyzed
                                ? 'border-green-500 text-green-200 cursor-not-allowed bg-slate-800' 
                                : 'border-yellow-500 text-yellow-100 hover:bg-slate-800 cursor-pointer'
                            }`}
            >
                <input
                    type="file"
                    id="file-input"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.zip,.rar"
                    disabled={isUploaded || isAnalyzed} // ✅ Disabled input file setelah upload/analisis
                />
                <CloudUploadIcon />
                <p className="mt-3 text-lg font-medium">Seret & Lepas File di Sini</p>
                <p className="text-sm">
                    {isAnalyzed ? 'Analisis Selesai.' : isUploaded ? 'File berhasil diunggah. Silakan RUN ANALISIS' : 'atau klik untuk memilih file. (PDF, DOCX, ZIP, RAR)'}
                </p>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                    onClick={handleUpload}
                    // ✅ Kondisi Disabled: files.length < 2, isUploading, isAnalyzing, ATAU SUDAH DIUPLOAD
                    disabled={!isReadyToUpload || isUploading || isAnalyzing || isUploaded}
                    className={uploadButtonClass} 
                >
                    {isUploading ? 'Mengunggah...' : `UPLOAD (${files.length} File)`}
                </button>

                <button
                    onClick={handleAnalyze}
                    // ✅ Kondisi Disabled: TIDAK isUploaded, isAnalyzing, isUploading, ATAU SUDAH DIANALISIS
                    disabled={!isUploaded || isAnalyzing || isUploading || isAnalyzed}
                    className={analyzeButtonClass} 
                >
                    {isAnalyzing ? 'Menganalisis...' : 'RUN ANALISIS'}
                </button>
            </div>
            
            {/* Pesan Syarat Minimum */}
            {!isUploaded && !isAnalyzed && !isReadyToUpload && (
                <p className="mt-3 text-center text-sm text-red-400">
                    *Minimal 2 file dibutuhkan untuk menjalankan analisis.
                </p>
            )}
        </div>
    );
};

export default UploadDropzone;