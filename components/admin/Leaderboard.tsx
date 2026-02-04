import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, query, orderByChild, startAt, remove } from 'firebase/database';

interface GameSession {
    id: string;
    players: { [uid: string]: { name: string } };
    score: number;
    createdAt: number;
    completedAt: number;
}

const Leaderboard: React.FC = () => {
    const [completedSessions, setCompletedSessions] = useState<GameSession[]>([]);

    useEffect(() => {
        const sessionsRef = query(ref(db, 'game_sessions'), orderByChild('completedAt'), startAt(1));
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessions: GameSession[] = Object.keys(data).map(id => ({
                    id,
                    ...data[id]
                }));
                sessions.sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    const timeA = a.completedAt - a.createdAt;
                    const timeB = b.completedAt - b.createdAt;
                    return timeA - timeB;
                });
                setCompletedSessions(sessions);
            } else {
                setCompletedSessions([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = (sessionId: string, teamName: string) => {
        if (window.confirm(`Are you sure you want to delete the leaderboard entry for team: ${teamName}?`)) {
            remove(ref(db, `game_sessions/${sessionId}`));
        }
    };

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    if (completedSessions.length === 0) {
        return <p className="text-slate-400">No completed missions on record.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="border-b-2 border-cyan-400/30 text-left">
                    <tr>
                        <th className="p-2">Rank</th>
                        <th className="p-2">Team</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {completedSessions.map((session, index) => {
                        const teamName = session.players ? Object.values(session.players).map(p => p.name).join(', ') : 'Unknown Team';
                        return (
                            <tr key={session.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                                <td className="p-2 font-bold text-cyan-300">#{index + 1}</td>
                                <td className="p-2">{teamName}</td>
                                <td className="p-2">{session.score}</td>
                                <td className="p-2">{formatDuration(session.completedAt - session.createdAt)}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDelete(session.id, teamName)}
                                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded text-xs transition-colors"
                                    >
                                        Delete
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

export default Leaderboard;
