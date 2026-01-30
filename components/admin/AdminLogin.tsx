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
            setError('ACCESS DENIED');
        }
    };

    if (isLoggedIn) {
        return <AdminPage />;
    }

    return (
        <div className="text-center bg-slate-900 bg-opacity-70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
            <h1 className="font-orbitron text-2xl md:text-3xl font-bold mb-2 text-cyan-300">CONTROL PANEL ACCESS</h1>
            <p className="text-slate-400 mb-6">Authorization required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter auth key"
                    className="font-orbitron p-3 bg-slate-800 border border-slate-700 rounded-md text-center text-lg text-cyan-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                    onClick={handleLogin}
                    className="font-orbitron bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-md text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
                >
                    AUTHENTICATE
                </button>
            </div>
            {error && <p className="text-red-400 mt-4 animate-pulse">{error}</p>}
        </div>
    );
};

export default AdminLogin;
