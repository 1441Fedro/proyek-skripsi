import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from './Modal'; // Pastikan Modal.jsx ada di folder yang sama

const API_URL = 'http://localhost:8000';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/`);
            setUsers(response.data);
        } catch (error) {
            console.error("Gagal mengambil data user:", error.response?.data || error.message);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser({ ...user, password: '' });
        setShowEditForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedData = {
            username: selectedUser.username,
            role: selectedUser.role,
        };

        if (selectedUser.password && selectedUser.password.trim() !== '') {
            updatedData.password = selectedUser.password;
        }

        try {
            await axios.put(`${API_URL}/users/${selectedUser.id}`, updatedData);
            toast.success("User updated successfully!");
            setShowEditForm(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user.");
            console.error(error);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const performDelete = async () => {
        try {
            await axios.delete(`${API_URL}/users/${userToDelete.id}`);
            toast.success("User deleted successfully!");
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user.");
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Daftar User</h2>
            <table className="w-full tabel-auto border-collapse rounded overflow-hidden shadow-md">
                <thead>
                    <tr className="bg-black text-white font-bold">
                        <th className="p-3 border-r-2">Username</th>
                        <th className="p-3 border-r-2">Role</th>
                        <th className="p-3 border-r-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr 
                            key={user.id}
                            className="hover:bg-cyan-300 hover:font-semibold transition duration-200 border-b"
                        >
                            <td className="p-3 break-words max-w-xs whitespace-normal">{user.username}</td>
                            <td className="p-3 capitalize break-words max-w-xs whitespace-normal">{user.role}</td>
                            <td className="p-3 break-words max-w-xs whitespace-normal">
                                <button
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </button>
                                {user.role !== 'admin' && (
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                                        onClick={() => confirmDelete(user)}
                                    >
                                        Hapus
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Edit */}
            <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
                <h3 className="text-lg font-semibold mb-4">Edit User</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={selectedUser?.username || ''}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, username: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Role</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={selectedUser?.role || 'assistant'}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, role: e.target.value })
                            }
                        >
                            <option value="assistant">Assistant</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Password Baru (Opsional)</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={selectedUser?.password || ''}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, password: e.target.value })
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Simpan Perubahan
                    </button>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Konfirmasi Hapus</h3>
                <p className="mb-4">
                    Apakah Anda yakin ingin menghapus user <strong>{userToDelete?.username}</strong>?
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        Batal
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={performDelete}
                    >
                        Hapus
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default UserList;
