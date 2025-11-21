import { useNavigate, Link, useLocation } from 'react-router-dom'
import React, { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = () => {
        // Hapus semua data sesi yang relevan
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        localStorage.removeItem('lastAnalysisResult')
        localStorage.removeItem('lastBatchId')
        navigate('/')
    }

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isAdmin = user?.role === 'admin';

    // Kelas tautan yang diperbarui
    const getLinkClass = (path) =>
        `px-4 py-2 rounded-full transition-colors duration-200 text-sm font-medium ${
            currentPath === path
                ? 'bg-blue-600 text-white shadow-md' // Pilihan aktif: Biru cerah, tulisan putih
                : 'text-gray-900 hover:bg-gray-200/50' // Pilihan tidak aktif: Teks gelap, hover transparan abu-abu
        }`;

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    }

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/upload', label: 'Upload' },
        { path: '/result', label: 'Hasil Analisis' },
        // Menu khusus admin
        ...(isAdmin ? [
            { path: '/admin/users', label: 'Manajemen User' },
            { path: '/admin/uploaded-reports', label: 'Daftar Laporan Akhir' },
        ] : []),
    ]

    return (
        // 1. Wrapper untuk posisi tetap (fixed) dan jarak (padding) dari atas dan samping
        <div className="fixed top-0 inset-x-0 z-50 p-4">
            
            {/* 2. Navbar Utama: Transparan, blur, rounded-xl, dan teks gelap */}
            <nav className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-3 flex justify-between items-center relative">
                
                {/* Logo/Nama Aplikasi */}
                <Link 
                    to="/dashboard" 
                    className="text-lg font-extrabold text-gray-900 flex-shrink-0"
                    onClick={handleLinkClick} // Tutup menu jika klik logo
                >
                    Plagiarism App
                </Link>

                {/* ✅ Bagian Tengah: Menu Desktop (Hidden di mobile) */}
                <div className="hidden lg:flex flex-grow justify-center mx-4">
                    <div className="flex space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={getLinkClass(link.path)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                
                {/* ✅ Bagian Kanan: Tombol Logout Desktop (Hidden di mobile) */}
                <button
                    onClick={logout}
                    className="hidden lg:block bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 font-medium text-sm text-white shadow-md flex-shrink-0"
                >
                    Logout
                </button>

                {/* ========================================================= */}
                {/* ✅ MOBILE TOGGLE BUTTON (Hanya Muncul di layar kecil) */}
                {/* ========================================================= */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {isMenuOpen ? (
                            // Ikon Tutup (X)
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            // Ikon Hamburger (☰)
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* ========================================================= */}
            {/* ✅ MOBILE MENU DROPDOWN (Hanya Muncul di Mobile dan Menu Dibuka) */}
            {/* ========================================================= */}
            {isMenuOpen && (
                // Menu akan muncul di bawah navbar utama, memenuhi lebar layar
                <div className="lg:hidden mt-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-3 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={handleLinkClick} // Tutup menu setelah klik
                            // Kelas untuk mobile menu (menjadi block penuh)
                            className="block px-4 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-200/80 transition duration-150"
                        >
                            {link.label}
                        </Link>
                    ))}
                    
                    {/* Tombol Logout Mobile (Selalu Muncul) */}
                    <button
                        onClick={() => { logout(); handleLinkClick(); }}
                        className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium text-sm transition duration-150 mt-2"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default Navbar