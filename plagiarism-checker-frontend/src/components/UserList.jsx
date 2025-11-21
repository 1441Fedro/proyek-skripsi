import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from './Modal';
import CreateUserForm from './CreateUserForm';

const API_URL = 'http://localhost:8000'; 

// Fungsi Helper untuk memformat waktu ke WIB/Asia/Jakarta
const formatWIB = (dateString) => {
    if (!dateString) return 'N/A';
    // Menggunakan Intl.DateTimeFormat dengan timeZone spesifik
    return new Date(dateString).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Opsional: menggunakan format 24 jam
    });
};

// Menerima prop onDataLoaded dari induk
const UserList = ({ onDataLoaded }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Helper untuk mendapatkan Header Otentikasi
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/users/`, getAuthHeaders());
            const fetchedUsers = response.data;
            setUsers(fetchedUsers);
            
            // ✅ Kirim data ringkasan ke komponen induk
            const adminCount = fetchedUsers.filter(u => u.role?.toLowerCase() === 'admin').length;
            const asistenCount = fetchedUsers.filter(u => u.role === 'Asisten').length;
            if(onDataLoaded) {
                onDataLoaded({
                    total: fetchedUsers.length,
                    admin: adminCount,
                    asisten: asistenCount
                });
            }

        } catch (error) {
            console.error("Gagal mengambil data user:", error.response?.data || error.message);
            toast.error("Gagal memuat data user.");
        } finally {
            setIsLoading(false);
        }
    }, [onDataLoaded]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreationSuccess = () => {
        setShowCreateForm(false); // Tutup modal
        fetchUsers(); // Refresh daftar pengguna
    };

    const handleEdit = (user) => {
        setSelectedUser({ 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            password: '', 
        });
        setShowEditForm(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const updatedData = {
            username: selectedUser.username,
            role: selectedUser.role,
        };
        if (selectedUser.password && selectedUser.password.trim() !== '') {
            updatedData.password = selectedUser.password;
        }

        try {
            await axios.put(`${API_URL}/users/${selectedUser.id}`, updatedData, getAuthHeaders());
            toast.success(`Pengguna ${selectedUser.username} berhasil diperbarui.`);
            setShowEditForm(false);
            fetchUsers(); 
        } catch (error) {
            console.error("Gagal memperbarui user:", error.response?.data || error.message);
            toast.error("Gagal memperbarui user. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const performDelete = async () => {
        if (!userToDelete) return;
        setIsSubmitting(true);

        try {
            await axios.delete(`${API_URL}/users/${userToDelete.id}`, getAuthHeaders());
            toast.success(`Pengguna ${userToDelete.username} berhasil dihapus.`);
            setShowDeleteConfirm(false);
            fetchUsers();
        } catch (error) {
            console.error("Gagal menghapus user:", error.response?.data || error.message);
            toast.error("Gagal menghapus user. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // FUNGSI: Mendapatkan kelas CSS untuk badge role
    const getRoleClasses = (role) => {
        const base = 'px-3 py-1 rounded-full text-xs font-semibold uppercase';
        if (role?.toLowerCase() === 'admin') {
            return `${base} bg-purple-100 text-purple-800`;
        }
        return `${base} bg-blue-100 text-blue-800`; 
    };

    // FUNGSI: Mendapatkan kelas untuk baris (Role-based & Hover Timbul)
    const getRowClasses = (role) => {
        const base = 'transition-all duration-300 cursor-pointer shadow-none hover:shadow-xl hover:scale-[1.005]';
        if (role?.toLowerCase() === 'admin') {
            return `${base} bg-purple-50/70 hover:bg-purple-100`;
        }
        return `${base} bg-blue-50/70 hover:bg-blue-100`; 
    };

    if (isLoading) {
        return <div className="text-center p-6 text-lg text-purple-600">Memuat data pengguna...</div>;
    }

    return (
        <div className="space-y-4 rounded-2xl shadow-2xl p-8 mt-8 bg-gradient-to-br from-gray-900 via-slate-900 to-yellow-300"> 
            {/* ✅ CONTAINER BARU UNTUK JUDUL DAN TOMBOL */}
            <div className="flex justify-between items-center p-6 border-b border-gray-300">
                {/* Judul Tabel */}
                <h2 className="text-xl font-bold text-yellow-300">Daftar Pengguna Aktif</h2>
                
                {/* Tombol Tambah User Baru */}
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition shadow-lg"
                >
                    {/* Ikon Sederhana (Optional, untuk visual) */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>Tambah User Baru</span>
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-lg">
                {/* ... (Tabel Users) ... */}
                <table className="min-w-full divide-y divide-purple-200 bg-white text-gray-900">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Tgl. Dibuat</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className={getRowClasses(user.role)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={getRoleClasses(user.role)}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {formatWIB(user.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex justify-center space-x-2">
                                        {/* ✅ Memanggil handleEdit untuk menampilkan modal */}
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-100 transition"
                                            title="Edit User"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                        </button>
                                        {/* ✅ Memanggil handleDelete untuk menampilkan konfirmasi */}
                                        <button
                                            onClick={() => handleDelete(user)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition"
                                            title="Hapus User"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal Edit User (Hanya Tampil jika showEditForm TRUE) */}
            <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
                <h3 className="text-xl font-bold mb-6 text-purple-700">Edit Pengguna: {selectedUser?.username}</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* ... (Input fields) ... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={selectedUser?.username || ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={selectedUser?.role || 'Asisten'}
                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        >
                            <option value="Admin">Admin</option>
                            <option value="Asisten">Asisten</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password Baru (opsional)</label>
                        <input
                            type="password"
                            value={selectedUser?.password || ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            placeholder="Isi jika ingin mengganti password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded font-bold transition ${isSubmitting ? 'bg-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </Modal>

            {/* ✅ Modal Konfirmasi Hapus (Hanya Tampil jika showDeleteConfirm TRUE) */}
            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Konfirmasi Hapus</h3>
                <p className="mb-4">
                    Apakah Anda yakin ingin menghapus user <strong>{userToDelete?.username}</strong>?
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSubmitting}
                    >
                        Batal
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={performDelete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Menghapus...' : 'Hapus'}
                    </button>
                </div>
            </Modal>

            {/* ✅ MODAL TAMBAH USER BARU */}
            <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
                <CreateUserForm 
                    onClose={() => setShowCreateForm(false)} 
                    onSuccess={handleCreationSuccess} // Panggil handler baru
                />
            </Modal>
        </div>
    );
};

export default UserList;