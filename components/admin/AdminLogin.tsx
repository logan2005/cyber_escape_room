import React, { useState } from 'react';
import AdminPage from './AdminPage';

const ADMIN_PASSWORD = "othanammadhan";

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Incorrect password.');
        }
    };

    if (isLoggedIn) {
        return <AdminPage />;
    }

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="p-2 border rounded"
            />
            <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
                Login
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default AdminLogin;
