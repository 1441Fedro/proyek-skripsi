import MainLayout from '../layouts/MainLayout';
import { useLocation } from 'react-router-dom'; // ✅ Tambahkan useLocation
import { useEffect, useState } from 'react';

// Ikon SVG sederhana untuk visual modern (dipertahankan)
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const UploadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>);
const ResultIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.232 4.679L15.3 12H17.765a2.25 2.25 0 012.155 1.558L21 21m-2.582-7.828l-4.226 4.226M13.5 10.5h.008v.008h-.008V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg\" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 18.07a4.5 4.5 0 01-1.897 1.13L6 20l1.9-6.39a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.5M21.75 12V10.5M..." /></svg>);
const DeleteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg\" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9.4A6.7 6.7 0 0119.5 12a6.7 6.7 0 01-4.74 2.6L12 17.5l-2.76-3.1a6.7 6.7 0 01-4.74-2.6 6.7 6.7 0 01-4.74-2.6l-2.76-3.1a6.7 6.7 0 01-4.74-2.6L12 17.5l-2.76-3.1a6.7 6.7 0 01-4.74-2.6L12 17.5z" /></svg>);
const ListIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h9.75m-9.75 3h9.75m-9.75 3h9.75m-9.75 3h9.75M19.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5z" /></svg>);


// Component untuk menampilkan langkah-langkah dalam kartu
const StepCard = ({ title, steps, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-bold text-gray-800 ml-3">{title}</h3>
        </div>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 flex-grow">
            {steps.map((step, index) => (
                <li key={index} className="pl-1 text-sm">{step}</li> // ✅ Ukuran font lebih kecil di daftar langkah
            ))}
        </ol>
    </div>
);

// Component untuk langkah-langkah Admin
const AdminStepCard = ({ title, steps, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-purple-500 transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-bold text-gray-800 ml-3">{title}</h3>
        </div>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 flex-grow">
            {steps.map((step, index) => (
                <li key={index} className="pl-1 text-sm">{step}</li> // ✅ Ukuran font lebih kecil di daftar langkah
            ))}
        </ol>
    </div>
);


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        // Pastikan scroll kembali ke atas saat halaman dimuat
        window.scrollTo(0, 0); 
    }, [location.pathname]);

    const username = user?.username || 'Pengguna';
    const role = user?.role || 'Asisten';
    const isAdmin = role.toLowerCase() === 'admin';

    return (
        // Wrapper Utama (Ganti warna latar belakang jika perlu)
        <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 p-4 sm:p-6 lg:p-8">
            <MainLayout>
                <div className="p-4 sm:p-6 lg:p-10 space-y-12">
                    
                    {/* ✅ 1. Judul & Selamat Datang (Ukuran Font Lebih Kecil di HP) */}
                    <header className="pb-4 border-b border-gray-300">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
                        <p className="text-xl sm:text-2xl text-gray-700 font-semibold">
                            Selamat Datang Kembali, <span className="text-gray-900">{username}</span>!
                        </p>
                        <p className="text-sm text-gray-300 mt-1">Anda login sebagai: <span className="font-medium capitalize">{role}</span></p>
                    </header>

                    {/* Catatan Penting */}
                    <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-yellow-800 mb-2">🔔 Catatan Penting</h2>
                        <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm"> {/* ✅ Ukuran Font Catatan Lebih Kecil */}
                            <li>Pastikan Anda telah mengupload semua file yang ingin dianalisis sebelum menjalankan proses analisis.</li>
                            <li>Proses analisis membutuhkan waktu. Harap bersabar setelah menekan tombol "Analisis Laporan".</li>
                            <li>Hasil analisis dapat dilihat di halaman "Hasil Analisis".</li>
                        </ul>
                    </section>

                    {/* Alur Kerja Asisten */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Alur Kerja Asisten</h2>
                        
                        {/* ✅ 2. Layout Kartu: Default 1 kolom, Medium 2 kolom, Large 3 kolom */}
                        {/* Kartu dibuat lebih lebar dan responsif */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                            <StepCard 
                                title="📂 Upload Dokumen"
                                steps={[
                                    "Siapkan semua dokumen (berkas) yang akan dianalisis dalam satu folder.",
                                    "Kunjungi halaman 'Upload & Analisis'.",
                                    "Pilih dan upload dokumen (mendukung format .pdf, .docx, .txt) atau file .zip.",
                                    "Tunggu hingga proses ekstraksi teks selesai.",
                                ]}
                                icon={<UploadIcon />}
                            />
                            <StepCard 
                                title="⚙️ Jalankan Analisis"
                                steps={[
                                    "Pada daftar laporan yang telah di-upload, cari laporan yang ingin dianalisis.",
                                    "Klik tombol 'Analisis Laporan Ini'.",
                                    "Sistem akan membandingkan laporan tersebut dengan semua laporan lain dalam batch yang sama.",
                                    "Tunggu konfirmasi bahwa analisis berhasil dijalankan.",
                                ]}
                                icon={<PlusIcon />}
                            />
                            <StepCard 
                                title="📋 Lihat Hasil"
                                steps={[
                                    "Kunjungi halaman 'Hasil Analisis'.",
                                    "Filter hasil berdasarkan Batch/ID analisis terbaru.",
                                    "Periksa skor kesamaan (TF-IDF, BERT, N-Gram) dan kolom 'Plagiat' (Ya/Tidak).",
                                    "Anda dapat mendownload hasil dalam format CSV.",
                                ]}
                                icon={<ResultIcon />}
                            />
                        </div>
                    </section>

                    {/* Alur Kerja Admin (Hanya jika Admin) */}
                    {isAdmin && (
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2 mt-10">
                                Alur Kerja Admin Tambahan
                            </h2>
                            {/* ✅ 3. Layout Kartu Admin: Default 1 kolom, Medium 2 kolom, Large 3 kolom */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                                <AdminStepCard 
                                    title="➕ Membuat Akun Asisten Baru"
                                    steps={[
                                        "Klik tombol 'Tambah Akun Baru' di halaman Manajemen User.",
                                        "Isi formulir dengan detail username, email, dan password yang unik.",
                                        "Tetapkan role sebagai 'Asisten'.",
                                        "Klik 'Buat Akun' untuk menyimpan.",
                                    ]}
                                    icon={<PlusIcon />}
                                />
                                <AdminStepCard 
                                    title="✏️ Mengubah Data Akun Pengguna"
                                    steps={[
                                        "Buka halaman Manajemen User.",
                                        "Cari akun yang ingin diperbarui dan klik tombol Edit.",
                                        "Perbarui data yang diperlukan pada formulir (biarkan password kosong jika tidak ingin diubah).",
                                        "Klik tombol Simpan Perubahan.",
                                    ]}
                                    icon={<EditIcon />}
                                />
                                <AdminStepCard 
                                    title="🗑️ Menghapus Data Akun Pengguna"
                                    steps={[
                                        "Buka halaman Manajemen User.",
                                        "Cari akun yang ingin dihapus.",
                                        "Klik tombol Hapus dan konfirmasi penghapusan.",
                                    ]}
                                    icon={<DeleteIcon />}
                                />
                                <AdminStepCard 
                                    title="📄 Melihat Daftar Semua Laporan"
                                    steps={[
                                        "Kunjungi halaman 'Daftar Laporan Akhir'.",
                                        "Anda dapat melihat semua laporan yang pernah diunggah oleh semua user.",
                                        "Data mencakup Nama File, User Pengupload, Tanggal, dan Teks Ekstraksi.",
                                    ]}
                                    icon={<ListIcon />}
                                />
                            </div>
                        </section>
                    )}
                </div>
            </MainLayout>
        </div>
    );
};

export default Dashboard;