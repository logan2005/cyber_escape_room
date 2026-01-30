

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import PlayerLobby from './components/PlayerLobby';
import AdminLogin from './components/admin/AdminLogin';

const App: React.FC = () => {
    const [uid, setUid] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                console.log("Signed in with UID:", user.uid);
            } else {
                try {
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error("Error signing in anonymously:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    if (!uid) {
        return (
            <div className="min-h-screen bg-grid flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-grid flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-2xl">
                <Routes>
                    <Route path="/" element={<PlayerLobby uid={uid} />} />
                    <Route path="/routuhthaladananau" element={<AdminLogin />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;