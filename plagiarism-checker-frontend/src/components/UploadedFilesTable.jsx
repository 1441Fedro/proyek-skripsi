import React from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-600">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

const UploadedFilesTable = ({ files, handleRemoveFile }) => {
    if (files.length === 0) {
        return (
            <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-xl text-gray-700">
                Belum ada file yang dipilih untuk diunggah.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">Daftar File ({files.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                    <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-150"
                    >
                        <div className="flex flex-col flex-grow truncate">
                            <span className="font-semibold text-gray-800 truncate">{file.name}</span>
                            <div className="flex space-x-3 text-xs text-gray-500 mt-1">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                    {file.name.split('.').pop().toUpperCase()}
                                </span>
                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemoveFile(index)}
                            className="flex-shrink-0 ml-4 p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                            title="Hapus File"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadedFilesTable;