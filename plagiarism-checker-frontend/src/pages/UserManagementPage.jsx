// UserManagementPage.jsx (Kode Final Rapi)
import React, { useState, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import UserList from '../components/UserList';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import CreateUserForm from '../components/CreateUserForm';

const UserManagementPage = () => {
    const [userCounts, setUserCounts] = useState({ total: 0, admin: 0, asisten: 0 });
    const [showCreateForm, setShowCreateForm] = useState(false); // State untuk modal Tambah Akun
    const [listKey, setListKey] = useState(0); // Key untuk memaksa refresh UserList

    // Fungsi yang dipanggil saat user baru berhasil dibuat: menutup modal dan me-refresh daftar user
    const handleCreationSuccess = useCallback(() => {
        setShowCreateForm(false); // Tutup modal
        setListKey(prevKey => prevKey + 1); // Paksa UserList untuk re-fetch
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-500 p-8">
            <MainLayout>
                <div className="p-10">
                {/* ✅ Judul Halaman yang Rapi */}
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-purple-300">
                    <h1 className="text-3xl font-extrabold text-gray-800">Manajemen Pengguna</h1>
                    {/* <Link 
                        to="/admin/create-user" 
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-md flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <span>Tambah User Baru</span>
                    </Link> */}
                    <button 
                        onClick={() => setShowCreateForm(true)} // Mengatur state untuk membuka modal
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-md flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <span>Tambah User Baru</span>
                    </button>
                </div>

                <section className="space-y-6">
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* ... (Kartu Total Pengguna, Admin, Asisten - Seperti di jawaban sebelumnya) ... */}
                        {/* Kartu 1: Total Pengguna */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-600 transform transition-transform duration-200 hover:scale-[1.01]">
                            <h3 className="text-base font-bold text-gray-500 mb-1">TOTAL PENGGUNA</h3>
                            <p className="text-4xl font-extrabold text-purple-700">{userCounts.total}</p>
                        </div>
                        {/* Kartu 2: Admin */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-600 transform transition-transform duration-200 hover:scale-[1.01]">
                            <h3 className="text-base font-bold text-gray-500 mb-1">ROLE: ADMIN</h3>
                            <p className="text-4xl font-extrabold text-blue-700">{userCounts.admin}</p>
                        </div>
                        {/* Kartu 3: Asisten */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600 transform transition-transform duration-200 hover:scale-[1.01]">
                            <h3 className="text-base font-bold text-gray-500 mb-1">ROLE: ASISTEN</h3>
                            <p className="text-4xl font-extrabold text-green-700">{userCounts.asisten}</p>
                        </div>
                    </div>

                    {/* Wrapper untuk Tabel UserList */}
                    <div className="p-0"> {/* Hapus padding/shadow ganda di sini, biarkan MainLayout yang menangani wrapper putih */}
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Pengguna Aktif</h2>
                        <UserList key={listKey} onDataLoaded={setUserCounts} /> 
                    </div>
                    
                </section>
                {/* Modal Tambah User Baru */}
                <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
                    <CreateUserForm onClose={() => setShowCreateForm(false)} onSuccess={handleCreationSuccess} />
                </Modal>
                </div>
            </MainLayout>
        </div>
    );
};

export default UserManagementPage;