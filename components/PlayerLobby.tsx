import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, query, orderByChild, equalTo } from 'firebase/database';
import Game from './Game';
import TeamReadyScreen from './TeamReadyScreen';
import GamePrelude from './GamePrelude';
import GameEndScreen from './GameEndScreen';

interface PlayerLobbyProps {
    uid: string;
}

const PlayerLobby: React.FC<PlayerLobbyProps> = ({ uid }) => {
    const [view, setView] = useState<'joining' | 'waiting' | 'team_ready' | 'prelude' | 'in_game' | 'game_end'>('joining');
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');
    const [gameSessionId, setGameSessionId] = useState<string | null>(null);

    const handleJoinLobby = () => {
        if (!playerName.trim()) {
            setError('Please enter your callsign.');
            return;
        }
        setError('');
        const playerRef = ref(db, `lobby/waiting_players/${uid}`);
        set(playerRef, { name: playerName, joinedAt: Date.now() })
            .then(() => setView('waiting'))
            .catch(() => setError('Connection to host lost. Please try again.'));
    };

    useEffect(() => {
        if (!uid) return;

        const sessionsRef = query(ref(db, 'game_sessions'), orderByChild(`players/${uid}/uid`), equalTo(uid));
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            if (snapshot.exists()) {
                const sessionsData = snapshot.val();
                const sessionId = Object.keys(sessionsData)[0];
                const session = sessionsData[sessionId];
                
                setGameSessionId(sessionId);
                
                // Only change view based on game state if we're not already in the game or game end
                // This prevents the prelude/team screens from showing during level transitions
                if (view !== 'in_game' && view !== 'game_end') {
                    if (session.currentView === 'playing') {
                        setView('in_game');
                    } else if (session.currentView === 'prelude') {
                        setView('prelude');
                    } else if (session.currentView === 'game_end') {
                        setView('game_end');
                    } else {
                        setView('team_ready');
                    }
                }
                
                // Special handling: if game is completed, show end screen
                if (session.currentView === 'game_end') {
                    setView('game_end');
                }
            }
        });

        return () => unsubscribe();
    }, [uid, view]);

    if (view === 'in_game' && gameSessionId) {
        return <Game uid={uid} sessionId={gameSessionId} />;
    }

    if (view === 'team_ready' && gameSessionId) {
        return <TeamReadyScreen uid={uid} sessionId={gameSessionId} />;
    }

    if (view === 'prelude' && gameSessionId) {
        return <GamePrelude sessionId={gameSessionId} />;
    }

    if (view === 'game_end' && gameSessionId) {
        return <GameEndScreen uid={uid} />;
    }

    const containerStyles = "text-center bg-slate-900 bg-opacity-70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm";

    if (view === 'waiting') {
        return (
            <div className={containerStyles}>
                <h1 className="font-orbitron text-2xl md:text-3xl font-bold mb-4 text-cyan-300">AWAITING DEPLOYMENT</h1>
                <p className="text-lg text-slate-300 animate-pulse">Connection established. Waiting for mission start from Control...</p>
            </div>
        );
    }

    // Default view is 'joining'
    return (
        <div className={containerStyles}>
            <h1 className="font-orbitron text-2xl md:text-3xl font-bold mb-2 text-cyan-300">AGENT LOGIN</h1>
            <p className="text-slate-400 mb-6">Identify yourself to join the operation.</p>
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your callsign"
                className="p-3 bg-slate-800 border border-slate-700 rounded-md w-full max-w-sm mb-4 text-center text-lg text-cyan-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none focus:border-cyan-400"
            />
            <button
                onClick={handleJoinLobby}
                className="font-orbitron bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-md w-full max-w-sm text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            >
                CONNECT
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
    );
};

export default PlayerLobby;

