import { useNavigate, Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname;

    const logout = () => {
        // Hapus semua data sesi yang relevan
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        localStorage.removeItem('lastAnalysisResult')
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

    return (
        // 1. Wrapper untuk posisi tetap (fixed) dan jarak (padding) dari atas dan samping
        <div className="fixed top-0 inset-x-0 z-50 p-4">
            
            {/* 2. Navbar Utama: Transparan, blur, rounded-xl, dan teks gelap */}
            <nav className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl 
                            p-4 flex justify-between items-center text-gray-900">
                
                <div className="flex items-center space-x-6">
                    {/* Judul: Font tebal dan ukuran besar */}
                    <span className="font-bold text-xl tracking-wider text-gray-900">
                        Plagiarism Checker
                    </span>
                    
                    <div className="flex space-x-2">
                        <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
                        <Link to="/upload" className={getLinkClass('/upload')}>Upload</Link>
                        <Link to="/result" className={getLinkClass('/result')}>Hasil Analisis</Link>
                        
                        {/* Menu Admin */}
                        {isAdmin && (
                            <>
                                <Link to="/admin/users" className={getLinkClass('/admin/users')}>
                                    Manajemen User
                                </Link>
                                <Link to="/admin/create-user" className={getLinkClass('/admin/create-user')}>
                                    Kelola Asisten
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Tombol Logout */}
                <button
                    onClick={logout}
                    className="bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 
                            font-medium text-sm text-white shadow-md"
                >
                    Logout
                </button>
            </nav>
        </div>
    )
}

export default Navbar