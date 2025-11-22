import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 min-h-screen overflow-y-auto">
            <div
                className="fixed inset-0 bg-white/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`
                    bg-white border border-gray-300 rounded-xl shadow-2xl p-6
                    w-[90%]           /* responsif untuk HP */
                    max-w-[600px]     /* batas ukuran popup di layar besar */
                    relative transform transition-all duration-300
                    scale-100 opacity-100 z-50 my-auto
                    ${className}
                `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-600 rounded-full transition"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
