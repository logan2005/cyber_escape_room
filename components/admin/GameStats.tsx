import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, query, orderByChild, equalTo, remove } from 'firebase/database';
import { LEVELS } from '../../levels';

interface GameSession {
    id: string;
    players: { [uid: string]: { name: string } };
    level: number;
    score: number;
    lastLevelCompletedAt: number;
    completedAt?: number;
}

const GameStats: React.FC = () => {
    const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);

    useEffect(() => {
        const sessionsRef = query(ref(db, 'game_sessions'), orderByChild('completedAt'), equalTo(null));
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessions = Object.keys(data).map(id => ({
                    id,
                    ...data[id]
                })).filter(session => !session.completedAt);
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
                        <th className="p-2">Last Progress</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeSessions.map(session => {
                        const teamName = Object.values(session.players).map(p => p.name).join(', ');
                        return (
                            <tr key={session.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                                <td className="p-2">{teamName}</td>
                                <td className="p-2">{session.level > LEVELS.length ? 'Finished' : session.level}</td>
                                <td className="p-2">{session.score || 0}</td>
                                <td className="p-2">
                                    {session.lastLevelCompletedAt ? new Date(session.lastLevelCompletedAt).toLocaleTimeString() : 'N/A'}
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
