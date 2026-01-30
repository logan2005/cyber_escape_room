import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, query, orderByChild, equalTo, remove } from 'firebase/database';

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
        return <p>No active games at the moment.</p>;
    }

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Live Game Stats</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr>
                            <th className="p-3 text-left">Team</th>
                            <th className="p-3 text-left">Current Level</th>
                            <th className="p-3 text-left">Score</th>
                            <th className="p-3 text-left">Last Progress</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeSessions.map(session => {
                            const teamName = Object.values(session.players).map(p => p.name).join(', ');
                            return (
                                <tr key={session.id} className="border-t border-gray-700">
                                    <td className="p-3">{teamName}</td>
                                    <td className="p-3">{session.level > TOTAL_LEVELS ? 'Finished' : session.level}</td>
                                    <td className="p-3">{session.score || 0}</td>
                                    <td className="p-3">
                                        {session.lastLevelCompletedAt ? new Date(session.lastLevelCompletedAt).toLocaleTimeString() : 'N/A'}
                                    </td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => handleTerminate(session.id, teamName)}
                                            className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded"
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
        </div>
    );
};

// We need to import TOTAL_LEVELS, let's just define it here for now.
const TOTAL_LEVELS = 5;

export default GameStats;
