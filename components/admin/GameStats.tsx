import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, query, orderByChild, equalTo, remove, update } from 'firebase/database';
import { LEVELS } from '../../levels';
import { POWERUPS, POWERUP_IDS } from '../../powerups';

interface GameSession {
    id: string;
    players: { [uid: string]: { name: string } };
    level: number;
    score: number;
    lastLevelCompletedAt: number;
    completedAt?: number;
    powerups?: {
        slots: (string | null)[];
    };
}

const GameStats: React.FC = () => {
    const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);

    useEffect(() => {
        const sessionsRef = query(ref(db, 'game_sessions'), orderByChild('completedAt'), equalTo(null));
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessions = Object.keys(data).map(id => {
                    const sessionData = data[id];
                    if (sessionData.powerups && sessionData.powerups.slots) {
                        const denseSlots = Array(3).fill(null);
                        for (const key in sessionData.powerups.slots) {
                            denseSlots[parseInt(key)] = sessionData.powerups.slots[key];
                        }
                        sessionData.powerups.slots = denseSlots;
                    }
                    return { id, ...sessionData };
                }).filter(session => !session.completedAt);
                setActiveSessions(sessions);
            } else {
                setActiveSessions([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleTerminate = (sessionId: string, teamName: string) => {
        if (window.confirm(`Are you sure you want to terminate the game for team: ${teamName}? This action cannot be undone.`)) {
            remove(ref(db, `game_sessions/${sessionId}`));
        }
    };

    const handleSpawnPowerup = (session: GameSession, powerupId: string) => {
        // Re-check with reconstructed array to be safe, though useEffect should handle it.
        const slots = Array(3).fill(null);
        if (session.powerups && session.powerups.slots) {
            for (const key in session.powerups.slots) {
                slots[parseInt(key)] = session.powerups.slots[key];
            }
        }

        if (!slots.includes(null)) {
            const teamName = session.players ? Object.values(session.players).map(p => p.name).join(', ') : 'Unknown Team';
            alert(`Team "${teamName}" has a full inventory.`);
            return;
        }

        const playerIds = Object.keys(session.players);
        const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];

        const newBubble = {
            visibleTo: randomPlayerId,
            id: `bubble_${Date.now()}`,
            powerupId: powerupId,
            position: { 
                top: `${Math.floor(Math.random() * 70) + 15}%`, 
                left: `${Math.floor(Math.random() * 70) + 15}%` 
            },
        };
        
        update(ref(db, `game_sessions/${session.id}`), { powerupBubble: newBubble });
    };

    if (activeSessions.length === 0) {
        return <p className="text-slate-400">No active missions.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="border-b-2 border-cyan-400/30 text-left">
                    <tr>
                        <th className="p-2">Team</th>
                        <th className="p-2">Level</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Spawn Powerup</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeSessions.map(session => {
                        const teamName = session.players ? Object.values(session.players).map(p => p.name).join(', ') : 'Unknown Team';
                        
                        const slots = Array(3).fill(null);
                        if (session.powerups && session.powerups.slots) {
                            for (const key in session.powerups.slots) {
                                slots[parseInt(key)] = session.powerups.slots[key];
                            }
                        }
                        const isInventoryFull = !slots.includes(null);

                        return (
                            <tr key={session.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                                <td className="p-2">{teamName}</td>
                                <td className="p-2">{session.level > LEVELS.length ? 'Finished' : session.level}</td>
                                <td className="p-2">{session.score || 0}</td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-1">
                                        {POWERUP_IDS.map(powerupId => (
                                            <button
                                                key={powerupId}
                                                onClick={() => handleSpawnPowerup(session, powerupId)}
                                                disabled={isInventoryFull}
                                                title={isInventoryFull ? 'Inventory full' : `Spawn ${POWERUPS[powerupId].name}`}
                                                className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded text-lg transition-colors hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {POWERUPS[powerupId].icon}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <button 
                                        onClick={() => handleTerminate(session.id, teamName)}
                                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded text-xs transition-colors"
                                    >
                                        Terminate
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default GameStats;
