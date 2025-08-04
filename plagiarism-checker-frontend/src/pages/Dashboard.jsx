// import Navbar from '../components/Navbar'
import MainLayout from '../layouts/MainLayout';
// import { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext'; // ganti sesuai struktur Anda

const Dashboard = () => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isAdmin = user?.role === 'admin';

    return (
        <MainLayout>
            <h1 className="text-2xl font-bold mb-6">Selamat datang di Dashboard</h1>

            <section className="space-y-6">
                {/* Card: Langkah-Langkah Analisis */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Langkah-Langkah Analisis Kesamaan Laporan Akhir Praktikum</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Klik menu <strong>Upload</strong> pada bar navigasi.</li>
                        <li>Pilih file laporan yang ingin diunggah dengan mengklik kotak unggah atau drag and drop ke dalam kotak tersebut.</li>
                        <li>Nama file akan muncul di bawah kotak unggah. Klik ikon <strong>X</strong> jika ingin menghapus file.</li>
                        <li>
                            Klik tombol <strong>Upload</strong> untuk mulai unggah file.
                            <p className="ml-6 text-sm text-gray-600 italic">
                                Catatan: Jika file laporan tidak memiliki bagian logika, maka tidak akan dianalisis karena tidak sesuai ketentuan laporan akhir.
                            </p>
                        </li>
                        <li>Setelah proses unggah selesai, klik tombol <strong>Analisis</strong> untuk memulai analisis.</li>
                        <li>Hasil analisis akan tampil di halaman <strong>Hasil Analisis</strong>. Untuk melihat berdasarkan nama laporan, buka kembali halaman Upload.</li>
                        <li>Untuk mengunduh hasil, klik tombol <strong>Ekspor CSV</strong>.</li>
                    </ol>
                </div>

                {/* Card: Catatan Penting & Manajemen Pengguna (khusus Admin) */}
                {isAdmin && (
                    <div className="space-y-6">
                        {/* Card: Catatan Penting */}
                        <div className="bg-yellow-100 rounded-2xl shadow p-6 border-l-4 border-yellow-500">
                            <h2 className="text-xl font-semibold mb-2">Catatan Penting (Khusus Admin)</h2>
                            <p className="text-gray-800">
                                Hanya <strong>admin</strong> yang dapat menambah, mengubah, mengatur, dan melihat data akun pengguna.
                            </p>
                        </div>

                        {/* Cards Horizontal: Tambah, Ubah, Hapus Akun */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Tambah Akun */}
                            <div className="flex-1 bg-white rounded-2xl shadow p-6">
                                <h3 className="text-lg font-semibold mb-3">Menambahkan Akun Pengguna Baru</h3>
                                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                    <li>Buka halaman <strong>Kelola Asisten</strong>.</li>
                                    <li>Isi formulir data pengguna baru.</li>
                                    <li>Klik tombol <strong>Buat Akun</strong>.</li>
                                    <li>Akun berhasil dibuat.</li>
                                </ol>
                            </div>

                            {/* Ubah Akun */}
                            <div className="flex-1 bg-white rounded-2xl shadow p-6">
                                <h3 className="text-lg font-semibold mb-3">Mengubah Data Akun Pengguna</h3>
                                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                    <li>Buka halaman <strong>Manajemen Asisten</strong>.</li>
                                    <li>Cari akun yang ingin diperbarui.</li>
                                    <li>Klik tombol <strong>Edit</strong>.</li>
                                    <li>Perbarui data pada formulir yang muncul.</li>
                                    <li>Klik tombol <strong>Simpan Perubahan</strong>.</li>
                                    <li>Data berhasil diperbarui.</li>
                                </ol>
                            </div>

                            {/* Hapus Akun */}
                            <div className="flex-1 bg-white rounded-2xl shadow p-6">
                                <h3 className="text-lg font-semibold mb-3">Menghapus Data Akun Pengguna</h3>
                                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                    <li>Buka halaman <strong>Manajemen Asisten</strong>.</li>
                                    <li>Cari akun yang ingin dihapus.</li>
                                    <li>Klik tombol <strong>Hapus</strong>.</li>
                                    <li>Konfirmasi penghapusan.</li>
                                    <li>Akun berhasil dihapus.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </MainLayout>
    );
};

export default Dashboard;
