// UserManagementPage.jsx (Kode Final Rapi)
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import UserList from '../components/UserList';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import CreateUserForm from '../components/CreateUserForm';

const UserManagementPage = () => {
    const [userCounts, setUserCounts] = useState({ total: 0, admin: 0, asisten: 0 });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-500 p-8">
            <MainLayout>
                <div className="p-4 lg:p-10">
                {/* ✅ Judul Halaman yang Rapi */}
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-purple-300">
                    <h1 className="text-3xl font-extrabold text-gray-800">Manajemen Pengguna</h1>
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

                <UserList onDataLoaded={setUserCounts} /> 

                </section>
                </div>
            </MainLayout>
        </div>
    );
};

export default UserManagementPage;