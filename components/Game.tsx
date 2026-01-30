import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { LEVELS } from '../levels';

interface GameProps {
    uid: string;
    sessionId: string;
}

const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
    const [gameState, setGameState] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            setGameState(snapshot.val());
        });
        return () => unsubscribe();
    }, [sessionId]);

    const { level, players, currentTypist } = gameState || {};

    const { sortedPlayerIds, myPlayerIndex, amITypist } = useMemo<{ sortedPlayerIds: string[]; myPlayerIndex: number; amITypist: boolean; }>(() => {
        if (!players || !uid) {
            return { sortedPlayerIds: [], myPlayerIndex: -1, amITypist: false };
        }
        const sortedIds = Object.keys(players).sort();
        const myIndex = sortedIds.indexOf(uid);
        const isTypist = currentTypist === uid;
        return { sortedPlayerIds: sortedIds, myPlayerIndex: myIndex, amITypist: isTypist };
    }, [players, uid, currentTypist]);

    const currentLevelData = level > 0 && level <= LEVELS.length ? LEVELS[level - 1] : null;

    const handleSubmitAnswer = () => {
        if (!currentLevelData) return;

        if (answer.trim().toLowerCase() === currentLevelData.answer.toLowerCase()) {
            advanceLevel();
            setError('');
            setAnswer('');
        } else {
            setError('Incorrect answer. Try again.');
        }
    };

    const advanceLevel = () => {
        const nextLevel = level + 1;
        const nextTypistIndex = (level) % sortedPlayerIds.length; // Use level (which is 1-based for the first level) for the modulo
        const nextTypistId = sortedPlayerIds[nextTypistIndex];
        
        const updates: { [key: string]: any } = {
            level: nextLevel,
            score: (gameState.score || 0) + 100,
            lastLevelCompletedAt: Date.now(),
            currentTypist: nextTypistId,
        };

        if (level === LEVELS.length) {
            updates.completedAt = Date.now();
        }

        update(ref(db, `game_sessions/${sessionId}`), updates);
    };

    if (!gameState || !currentLevelData) {
        if (gameState && level > LEVELS.length) {
            const teamNames = Object.values(gameState.players).map((p: any) => p.name).join(', ');
            return <div className="text-center"><h1 className="text-3xl">Game Complete!</h1><p>Team: {teamNames}</p></div>;
        }
        return <p className="text-center">Loading game state...</p>;
    }

    const myClue = currentLevelData.clues[myPlayerIndex % currentLevelData.clues.length];

    return (
        <div className="text-center p-4 bg-gray-800 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Level {level}</h1>
            <p className="text-lg mb-4">{currentLevelData.question}</p>

            <div className="bg-gray-900 p-4 rounded-lg my-4">
                <h2 className="text-xl font-semibold mb-2">Your Clue:</h2>
                <p className="text-2xl font-mono animate-pulse">{myClue}</p>
            </div>

            <div className="my-4">
                <p>The current typist is: <span className="font-bold">{players[currentTypist]?.name || '...'}</span></p>
            </div>
            
            {amITypist && (
                <div className="mt-6">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                        placeholder="Enter the team's answer"
                        className="p-2 border rounded bg-gray-900 w-full max-w-xs mb-2"
                    />
                    <button
                        onClick={handleSubmitAnswer}
                        className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full max-w-xs"
                    >
                        Submit Answer
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default Game;