import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import GlassPanel from './ui/GlassPanel';
import NeonButton from './ui/NeonButton';

interface TeamReadyScreenProps {
    uid: string;
    sessionId: string;
}

interface Player {
    uid: string;
    name: string;
}

interface Team {
    [uid: string]: Player;
}

const TeamReadyScreen: React.FC<TeamReadyScreenProps> = ({ uid, sessionId }) => {
    const [team, setTeam] = useState<Team>({});
    const [readyPlayers, setReadyPlayers] = useState<{[uid: string]: boolean}>({});
    const [allReady, setAllReady] = useState(false);

    useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            const sessionData = snapshot.val();
            if (sessionData && sessionData.players) {
                setTeam(sessionData.players);
                setReadyPlayers(sessionData.readyPlayers || {});
            }
        });

        return () => unsubscribe();
    }, [sessionId]);

    useEffect(() => {
        const playerCount = Object.keys(team).length;
        const readyCount = Object.keys(readyPlayers).filter(uid => readyPlayers[uid]).length;
        
        if (playerCount > 0 && readyCount === playerCount) {
            setAllReady(true);
        } else {
            setAllReady(false);
        }
    }, [team, readyPlayers]);

    const handleReady = () => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        update(sessionRef, {
            [`readyPlayers/${uid}`]: true
        });
    };

    const handleNotReady = () => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        update(sessionRef, {
            [`readyPlayers/${uid}`]: false
        });
    };

    const teamMembers = Object.values(team);
    const readyCount = Object.keys(readyPlayers).filter(uid => readyPlayers[uid]).length;

    if (allReady) {
        // Auto-start prelude when all ready
        setTimeout(() => {
            const sessionRef = ref(db, `game_sessions/${sessionId}`);
            update(sessionRef, {
                currentView: 'prelude',
                readyPlayers: null // Clean up ready state
            });
        }, 1500);

        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl text-center">
                    <div className="animate-pulse">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center animate-glow">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h1 className="font-orbitron text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            MISSION BRIEFING
                        </h1>
                        <p className="text-green-400 text-lg animate-pulse">
                            All team members ready. Initiating mission briefing...
                        </p>
                        
                        {/* Loading animation */}
                        <div className="mt-8">
                            <div className="w-full bg-slate-800 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-1500 ease-out"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <GlassPanel
                    glowing
                    neonColor="purple"
                    title="👥 SQUAD DEPLOYMENT"
                    icon="⚡"
                    floating
                    className="w-full"
                >
                    <div className="space-y-8">
                        <div className="text-center">
                            <p className="text-slate-300 text-lg">
                                Your elite squad has been assembled. Confirm readiness to begin the cyber operation.
                            </p>
                        </div>

                        {/* Team Members Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamMembers.map((player) => (
                                <div
                                    key={player.uid}
                                    className={`
                                        relative overflow-hidden
                                        rounded-xl border-2 p-6 text-center
                                        transition-all duration-300 transform
                                        hover:scale-105
                                        ${readyPlayers[player.uid] 
                                            ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-400/50' 
                                            : 'bg-slate-800/40 border-slate-600/50'
                                        }
                                        ${player.uid === uid ? 'ring-2 ring-cyan-400/50' : ''}
                                    `}
                                    style={{
                                        boxShadow: readyPlayers[player.uid] 
                                            ? '0 0 20px rgba(0, 255, 0, 0.3)' 
                                            : '0 0 10px rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {/* Status indicator */}
                                    <div className="absolute top-3 right-3">
                                        <div className={`w-3 h-3 rounded-full ${readyPlayers[player.uid] ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`}></div>
                                    </div>

                                    {/* Player avatar */}
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-2xl">
                                            {player.uid === uid ? '👤' : '🤖'}
                                        </span>
                                    </div>

                                    {/* Player info */}
                                    <h3 className={`font-orbitron text-lg font-bold mb-2 ${
                                        readyPlayers[player.uid] ? 'text-green-400' : 'text-cyan-300'
                                    }`}>
                                        {player.name}
                                    </h3>
                                    
                                    <div className={`text-sm ${readyPlayers[player.uid] ? 'text-green-300' : 'text-slate-400'}`}>
                                        {readyPlayers[player.uid] ? (
                                            <span className="flex items-center justify-center space-x-1">
                                                <span>✓</span>
                                                <span>READY</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center space-x-1">
                                                <span>⏳</span>
                                                <span>AWAITING</span>
                                            </span>
                                        )}
                                    </div>
                                    
                                    {player.uid === uid && (
                                        <div className="mt-2">
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                                                YOU
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Status Summary */}
                        <div className="text-center bg-slate-800/40 rounded-xl p-6 border border-slate-600/50">
                            <div className="text-2xl font-bold mb-2">
                                <span className={readyCount === teamMembers.length ? 'text-green-400' : 'text-cyan-300'}>
                                    {readyCount}
                                </span>
                                <span className="text-slate-400"> / </span>
                                <span className="text-slate-300">{teamMembers.length}</span>
                            </div>
                            <p className="text-slate-400">
                                {readyCount === teamMembers.length ? (
                                    <span className="text-green-400">All operatives ready for deployment!</span>
                                ) : readyCount > 0 ? (
                                    <span>{readyCount} team member{readyCount > 1 ? 's' : ''} ready. Awaiting others...</span>
                                ) : (
                                    <span>Be the first to confirm readiness...</span>
                                )}
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="text-center">
                            {readyPlayers[uid] ? (
                                <div className="space-y-3">
                                    <NeonButton
                                        onClick={handleNotReady}
                                        color="yellow"
                                        size="lg"
                                        glow
                                        className="w-full max-w-sm"
                                    >
                                        <span className="text-lg">⚠️ CANCEL READINESS</span>
                                    </NeonButton>
                                    <p className="text-green-400 text-sm animate-pulse">
                                        Ready status confirmed. Waiting for other team members...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <NeonButton
                                        onClick={handleReady}
                                        disabled={allReady}
                                        color="green"
                                        size="lg"
                                        glow
                                        pulse
                                        className="w-full max-w-sm"
                                    >
                                        <span className="text-lg">✅ CONFIRM READINESS</span>
                                    </NeonButton>
                                    <p className="text-slate-400 text-sm">
                                        {readyCount > 0 ? `${readyCount} team member${readyCount > 1 ? 's' : ''} ready. Waiting for others...` : 'Be the first to confirm readiness.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default TeamReadyScreen;