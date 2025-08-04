import React from 'react';
import MainLayout from '../layouts/MainLayout';
import UserList from '../components/UserList';

const UserManagementPage = () => {
    return (
        <MainLayout>
            <UserList />
        </MainLayout>
    );
};

export default UserManagementPage;
