import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, query, orderByChild, equalTo } from 'firebase/database';
import Game from './Game';

interface PlayerLobbyProps {
    uid: string;
}

const PlayerLobby: React.FC<PlayerLobbyProps> = ({ uid }) => {
    const [view, setView] = useState<'joining' | 'waiting' | 'in_game'>('joining');
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');
    const [gameSessionId, setGameSessionId] = useState<string | null>(null);

    const handleJoinLobby = () => {
        if (!playerName.trim()) {
            setError('Please enter a name.');
            return;
        }
        setError('');
        const playerRef = ref(db, `lobby/waiting_players/${uid}`);
        set(playerRef, { name: playerName, joinedAt: Date.now() })
            .then(() => setView('waiting'))
            .catch(() => setError('Failed to join the lobby. Please try again.'));
    };

    useEffect(() => {
        if (!uid) return;

        const sessionsRef = query(ref(db, 'game_sessions'), orderByChild(`players/${uid}/uid`), equalTo(uid));
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            if (snapshot.exists()) {
                const sessionsData = snapshot.val();
                const sessionId = Object.keys(sessionsData)[0];
                setGameSessionId(sessionId);
                setView('in_game'); // Go directly to the game
            }
        });

        return () => unsubscribe();
    }, [uid]);

    if (view === 'in_game' && gameSessionId) {
        return <Game uid={uid} sessionId={gameSessionId} />;
    }

    if (view === 'waiting') {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">You are in the lobby!</h1>
                <p className="text-xl animate-pulse">Waiting for the admin to start the game...</p>
            </div>
        );
    }

    // Default view is 'joining'
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Join the Cyber Escape Room</h1>
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your agent name"
                className="p-2 border rounded w-full max-w-xs mb-4"
            />
            <button
                onClick={handleJoinLobby}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full max-w-xs"
            >
                Join Lobby
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default PlayerLobby;

