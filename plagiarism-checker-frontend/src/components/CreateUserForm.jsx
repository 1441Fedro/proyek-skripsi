import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000'; 

const CreateUserForm = ({ onClose, onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Asisten'); // Default role
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // const getAuthHeaders = () => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         toast.error("Token tidak ditemukan. Harap login ulang.");
    //         return {};
    //     }
    //     return {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         }
    //     };
    // };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Pastikan API Endpoint dan data sesuai
            await axios.post(`${API_URL}/users/create`, {
                username,
                email,
                password,
                role,
            });
            
            toast.success(`Akun ${username} berhasil dibuat!`);
            
            // Panggil onSuccess untuk me-refresh daftar user dan onClose untuk menutup modal
            if (onSuccess) onSuccess();
            if (onClose) onClose();
            // Reset form
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('Asisten');

        } catch (err) {
            const errorDetail = err.response?.data?.detail || 'Terjadi kesalahan saat membuat akun.';
            console.error("Create user error:", err);
            toast.error(errorDetail);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-2">
            <h3 className="text-2xl font-bold mb-6 text-purple-700">Buat Akun Pengguna Baru</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-purple-500 focus:border-purple-500"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-purple-500 focus:border-purple-500"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-purple-500 focus:border-purple-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-purple-500 focus:border-purple-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Asisten">Asisten</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-lg font-bold transition ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                    {isSubmitting ? 'Membuat Akun...' : 'Buat Akun'}
                </button>
            </form>
        </div>
    );
};

export default CreateUserForm;