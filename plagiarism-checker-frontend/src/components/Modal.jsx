const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        // ✅ Backdrop Blur dan Warna Gelap
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
                className="fixed inset-0 bg-white-100 bg-opacity-50 backdrop-blur-sm" 
                onClick={onClose} 
            />
            
            {/* Konten Modal */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-2xl p-6 w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100 z-50">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-light"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;