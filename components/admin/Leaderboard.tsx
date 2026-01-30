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
        return <p>No games have been completed yet.</p>;
    }

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr>
                            <th className="p-3 text-left">Rank</th>
                            <th className="p-3 text-left">Team</th>
                            <th className="p-3 text-left">Score</th>
                            <th className="p-3 text-left">Time Taken</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedSessions.map((session, index) => {
                            const teamName = Object.values(session.players).map(p => p.name).join(', ');
                            return (
                                <tr key={session.id} className="border-t border-gray-700">
                                    <td className="p-3 font-bold">{index + 1}</td>
                                    <td className="p-3">{teamName}</td>
                                    <td className="p-3">{session.score}</td>
                                    <td className="p-3">{formatDuration(session.completedAt - session.createdAt)}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDelete(session.id, teamName)}
                                            className="bg-gray-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded"
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
        </div>
    );
};

export default Leaderboard;
