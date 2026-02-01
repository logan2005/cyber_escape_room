import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

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
            <div className="text-center bg-slate-900 bg-opacity-70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                <h1 className="font-orbitron text-2xl md:text-3xl font-bold mb-4 text-cyan-300">MISSION BRIEFING</h1>
                <p className="text-lg text-green-400 animate-pulse">All team members ready. Initiating mission briefing...</p>
            </div>
        );
    }

    return (
        <div className="text-center bg-slate-900 bg-opacity-70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
            <h1 className="font-orbitron text-2xl md:text-3xl font-bold mb-4 text-cyan-300">TEAM DEPLOYMENT</h1>
            <p className="text-slate-400 mb-6">Your squad has been assembled. Confirm readiness to begin the mission.</p>
            
            <div className="mb-6">
                <h2 className="font-orbitron text-lg md:text-xl font-semibold mb-3 text-cyan-400">SQUAD MEMBERS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {teamMembers.map(player => (
                        <div key={player.uid} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                            <div className="text-lg font-semibold text-cyan-300">{player.name}</div>
                            <div className={`text-sm mt-2 ${readyPlayers[player.uid] ? 'text-green-400' : 'text-yellow-400'}`}>
                                {readyPlayers[player.uid] ? '✓ READY' : '⏳ AWAITING'}
                            </div>
                            {player.uid === uid && (
                                <div className="text-xs text-cyan-500 mt-1">YOU</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <div className="text-lg text-slate-300">
                    Ready Status: <span className={`font-bold ${readyCount === teamMembers.length ? 'text-green-400' : 'text-yellow-400'}`}>
                        {readyCount} / {teamMembers.length}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {readyPlayers[uid] ? (
                    <div>
                        <button
                            onClick={handleNotReady}
                            className="font-orbitron bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-md w-full max-w-sm text-lg transition-all duration-300"
                        >
                            CANCEL READINESS
                        </button>
                        <p className="text-green-400 mt-2">Ready status confirmed. Waiting for other team members...</p>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={handleReady}
                            disabled={allReady}
                            className="font-orbitron bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-3 px-6 rounded-md w-full max-w-sm text-lg transition-all duration-300 disabled:bg-slate-600 disabled:shadow-none"
                        >
                            CONFIRM READINESS
                        </button>
                        <p className="text-slate-400 text-sm mt-2">
                            {readyCount > 0 ? `${readyCount} team member(s) ready. Waiting for others...` : 'Be the first to confirm readiness.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamReadyScreen;