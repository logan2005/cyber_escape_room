import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, query, orderByChild, equalTo } from 'firebase/database';
import Game from './Game';
import TeamReadyScreen from './TeamReadyScreen';
import GamePrelude from './GamePrelude';
import GameEndScreen from './GameEndScreen';
import FuturisticBackground from './ui/FuturisticBackground';
import GlassPanel from './ui/GlassPanel';
import NeonButton from './ui/NeonButton';

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

    if (view === 'waiting') {
        return (
            <>
                <FuturisticBackground />
                <div className="min-h-screen flex items-center justify-center p-4">
                    <GlassPanel
                        glowing
                        neonColor="cyan"
                        title="🚀 AWAITING DEPLOYMENT"
                        icon="⚡"
                        floating
                        className="w-full max-w-md"
                    >
                        <div className="text-center">
                            <div className="animate-pulse mb-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-2xl">🔗</span>
                                </div>
                                <p className="text-cyan-300 text-lg font-orbitron">Connection established</p>
                                <p className="text-slate-300 mt-2">Waiting for mission start from Control...</p>
                            </div>
                            
                            {/* Animated status dots */}
                            <div className="flex justify-center space-x-2 mt-6">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.2}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </>
        );
    }

    // Default view is 'joining' - Futuristic login screen
    return (
        <>
            <FuturisticBackground />
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    {/* Animated logo */}
                    <div className="text-center mb-8 animate-float">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center animate-glow">
                            <span className="text-4xl">🎯</span>
                        </div>
                        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                            CYBER
                        </h1>
                        <h2 className="font-orbitron text-2xl font-bold text-cyan-300">
                            TREASURE HUNT
                        </h2>
                    </div>

                    <GlassPanel
                        glowing
                        neonColor="cyan"
                        title="🔐 AGENT LOGIN"
                        icon="⚡"
                        className="w-full"
                    >
                        <div className="space-y-6">
                            <p className="text-slate-300 text-center">
                                Identify yourself to join the cyber operation
                            </p>
                            
                            <div className="relative">
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="Enter your callsign"
                                    className="w-full px-6 py-4 rounded-lg
                                        bg-slate-800/60 border-2 border-cyan-400/30
                                        text-cyan-300 text-lg font-orbitron
                                        focus:outline-none focus:border-cyan-400
                                        focus:shadow-lg focus:shadow-cyan-400/50
                                        transition-all duration-300
                                        backdrop-blur-sm"
                                    style={{
                                        boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1)'
                                    }}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
                                    <span className="text-xl">👤</span>
                                </div>
                            </div>

                            <NeonButton
                                onClick={handleJoinLobby}
                                color="cyan"
                                size="lg"
                                glow
                                className="w-full"
                            >
                                <span className="text-lg">🔌 CONNECT</span>
                            </NeonButton>

                            {error && (
                                <div className="text-center">
                                    <p className="text-red-400 font-orbitron animate-pulse">
                                        ⚠️ {error}
                                    </p>
                                </div>
                            )}

                            {/* Status indicators */}
                            <div className="flex justify-center space-x-4 text-xs text-slate-400">
                                <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span>SYSTEM ONLINE</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                    <span>NETWORK SECURE</span>
                                </span>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </>
    );
};

export default PlayerLobby;