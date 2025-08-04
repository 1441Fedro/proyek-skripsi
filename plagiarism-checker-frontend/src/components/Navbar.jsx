import { useNavigate, Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname;

    const logout = () => {
        // localStorage.clear()
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        localStorage.removeItem('lastAnalysisResult')
        navigate('/')
    }

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isAdmin = user?.role === 'admin';

    const getLinkClass = (path) =>
        `px-3 py-1 rounded ${
            currentPath === path
                ? 'bg-white text-gray-800 font-semibold'
                : 'hover:underline'
    }`;

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <span className="font-bold">Plagiarism Checker</span>
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
                <Link to="/upload" className={getLinkClass('/upload')}>Upload</Link>
                <Link to="/result" className={getLinkClass('/result')}>Hasil Analisis</Link>
                {isAdmin && (
                    <>
                        {/* <Link to="/uploaded-reports" className={getLinkClass('/uploaded-reports')}>
                            Laporan Terunggah
                        </Link> */}
                        <Link to="/admin/users" className={getLinkClass('/admin/users')}>
                            Manajemen User
                        </Link>
                        <Link to="/admin/create-user" className={getLinkClass('/admin/create-user')}>
                            Kelola Asisten
                        </Link>
                    </>
                )}
            </div>
            <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </nav>
    )
}

export default Navbar
