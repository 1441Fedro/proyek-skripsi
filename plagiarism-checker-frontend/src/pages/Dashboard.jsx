import MainLayout from '../layouts/MainLayout';

// Ikon SVG sederhana untuk visual modern
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 18.07a4.5 4.5 0 01-1.897 1.13L6 20l1.9-6.39a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.5M21.75 12V10.5M15 15l-1.5 1.5M7.5 16.5l-1.5 1.5M6 18l-1.5 1.5" /></svg>);
const DeleteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9.49l-.35-.67A2.25 2.25 0 0012.24 7.5H1.76a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25H12.24a2.25 2.25 0 002.25-2.25v-1.5M10.5 7.5H13.5M12 10.5v3" /></svg>);


const Dashboard = () => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isAdmin = user?.role === 'admin';

    // Komponen Card untuk langkah-langkah admin
    const AdminStepCard = ({ title, steps, icon }) => (
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition duration-300">
            {/* Kiri: Judul dan Langkah */}
            <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                    {steps.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
            </div>
            {/* Kanan: Ikon SVG */}
            <div className="flex-shrink-0 pt-1">
                {icon}
            </div>
        </div>
    );

    return (
        // Mengubah latar belakang menjadi gradien ungu ke biru
        <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 p-8">
            <MainLayout>
                <div className="max-w-6xl mx-auto py-8">
                    <h1 className="text-3xl font-extrabold mb-8 text-white">
                        <span className="bg-white text-transparent bg-clip-text">Selamat Datang</span>, {user?.username}!
                    </h1>

                    <section className="space-y-8">
                        {/* Card: Langkah-Langkah Analisis - Warna Putih dengan Shadow Halus */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 transform transition duration-500 hover:scale-[1.01]">
                            <h2 className="text-2xl font-bold mb-6 text-blue-700">
                                🚀 Alur Analisis Kesamaan Laporan Akhir Praktikum
                            </h2>
                            <ol className="list-decimal list-inside space-y-4 text-gray-700">
                                <li className="font-medium">
                                    Akses halaman <strong>Upload</strong>.
                                </li>
                                <li className="font-medium">
                                    Unggah file laporan (PDF/DOCX) atau arsip (ZIP/RAR) dengan *Drag and Drop* atau *Click*.
                                </li>
                                <li className="font-medium">
                                    Tinjau daftar file, dan pastikan hanya file yang **memiliki bagian logika** yang dipertahankan.
                                    <p className="ml-6 mt-1 text-sm text-red-500 italic">
                                        Catatan: File tanpa bagian logika akan diabaikan dari analisis.
                                    </p>
                                </li>
                                <li className="font-medium">
                                    Setelah unggah berhasil, klik tombol <strong>Analisis</strong>.
                                </li>
                                <li className="font-medium">
                                    Lihat hasil perbandingan di halaman <strong>Hasil Analisis</strong>.
                                </li>
                                <li className="font-medium">
                                    Gunakan tombol <strong>Ekspor CSV</strong> untuk mengunduh laporan detail analisis.
                                </li>
                            </ol>
                        </div>

                        {/* Card: Catatan Penting & Manajemen Pengguna (khusus Admin) */}
                        {isAdmin && (
                            <div className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-purple-500">
                                <h2 className="text-2xl font-bold mb-6 flex items-center text-purple-700">
                                    ⭐ Catatan Penting & Manajemen Pengguna (Admin)
                                </h2>
                                <p className="text-gray-700 mb-6 border-b pb-4">
                                    Sebagai **Admin**, Anda memiliki kendali penuh atas sistem, termasuk pengelolaan akun **Asisten**.
                                </p>

                                {/* Konten Admin disusun berjejer ke bawah */}
                                <div className="space-y-4">
                                    <AdminStepCard 
                                        title="➕ Menambahkan Akun Pengguna Baru"
                                        steps={[
                                            "Buka halaman Kelola Asisten.",
                                            "Isi formulir dengan data pengguna baru (Username, Email, Password, Role).",
                                            "Klik tombol Buat Akun.",
                                        ]}
                                        icon={<PlusIcon />}
                                    />
                                    <AdminStepCard 
                                        title="✏️ Mengubah Data Akun Pengguna"
                                        steps={[
                                            "Buka halaman Manajemen Asisten.",
                                            "Cari akun yang ingin diperbarui dan klik tombol Edit.",
                                            "Perbarui data yang diperlukan pada formulir.",
                                            "Klik tombol Simpan Perubahan.",
                                        ]}
                                        icon={<EditIcon />}
                                    />
                                    <AdminStepCard 
                                        title="🗑️ Menghapus Data Akun Pengguna"
                                        steps={[
                                            "Buka halaman Manajemen Asisten.",
                                            "Cari akun yang ingin dihapus.",
                                            "Klik tombol Hapus dan konfirmasi penghapusan.",
                                        ]}
                                        icon={<DeleteIcon />}
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </MainLayout>
        </div>
    );
};

export default Dashboard;