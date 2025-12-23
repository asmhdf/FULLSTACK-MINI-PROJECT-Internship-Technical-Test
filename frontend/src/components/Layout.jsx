import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
                <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                    Task Manager
                </Link>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Welcome, {user?.email || 'User'}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main className="p-8 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
