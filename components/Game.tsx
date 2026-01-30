import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { LEVELS } from '../levels';
import { FAIL_MEME_VIDEOS, SUCCESS_MEME_VIDEOS } from '../constants';
import TeamStatsHUD from './TeamStatsHUD';
import MemePlayer from './MemePlayer';

interface GameProps {
    uid: string;
    sessionId: string;
}

const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
    const [gameState, setGameState] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [currentMemeDisplayUrl, setCurrentMemeDisplayUrl] = useState<string | null>(null);

    useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            const data = snapshot.val();
            setGameState(data);
            // Prioritize success memes over failure memes if both are somehow present
            if (data?.lastSuccessMemeUrl) {
                setCurrentMemeDisplayUrl(data.lastSuccessMemeUrl);
            } else if (data?.lastFailureMemeUrl) {
                setCurrentMemeDisplayUrl(data.lastFailureMemeUrl);
            } else {
                setCurrentMemeDisplayUrl(null);
            }
        });
        return () => unsubscribe();
    }, [sessionId]);

    const { level, players, currentTypist, shownMemes, shownSuccessMemes } = gameState || {};

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
            setError('Incorrect answer. A penalty has been issued.');
            triggerFailMeme();
        }
    };

    const triggerFailMeme = () => {
        let shownMemesForLevel = shownMemes?.[level] || [];
        let availableMemes = FAIL_MEME_VIDEOS.filter(meme => !shownMemesForLevel.includes(meme));

        if (availableMemes.length === 0) {
            availableMemes = FAIL_MEME_VIDEOS;
            shownMemesForLevel = []; // Reset for this level if all were shown
        }

        const randomMeme = availableMemes[Math.floor(Math.random() * availableMemes.length)];
        
        const updates: { [key: string]: any } = {
            lastFailureMemeUrl: randomMeme,
            [`shownMemes/${level}`]: [...shownMemesForLevel, randomMeme],
        };
        update(ref(db, `game_sessions/${sessionId}`), updates);
    };

    const handleCloseMeme = () => {
        setCurrentMemeDisplayUrl(null);
        // Clear both meme URLs in Firebase so they don't re-show on refresh
        update(ref(db, `game_sessions/${sessionId}`), { 
            lastFailureMemeUrl: null,
            lastSuccessMemeUrl: null,
        });
    };

    const advanceLevel = () => {
        const nextLevel = level + 1;
        const nextTypistIndex = (level) % sortedPlayerIds.length;
        const nextTypistId = sortedPlayerIds[nextTypistIndex];
        
        // --- Success Meme Logic ---
        let shownSuccessMemesForLevel = shownSuccessMemes?.[level] || [];
        let availableSuccessMemes = SUCCESS_MEME_VIDEOS.filter(meme => !shownSuccessMemesForLevel.includes(meme));

        if (availableSuccessMemes.length === 0) {
            availableSuccessMemes = SUCCESS_MEME_VIDEOS;
            shownSuccessMemesForLevel = [];
        }
        const randomSuccessMeme = availableSuccessMemes[Math.floor(Math.random() * availableSuccessMemes.length)];
        // --- End Success Meme Logic ---

        const updates: { [key: string]: any } = {
            level: nextLevel,
            score: (gameState.score || 0) + 100,
            lastLevelCompletedAt: Date.now(),
            currentTypist: nextTypistId,
            // Clear any lingering error messages or failure memes from the previous level
            error: null,
            lastFailureMemeUrl: null,
            [`shownMemes/${level}`]: null, // Clear failure memes history for this level
            // Set success meme
            lastSuccessMemeUrl: randomSuccessMeme,
            [`shownSuccessMemes/${level}`]: [...shownSuccessMemesForLevel, randomSuccessMeme],
        };

        if (level === LEVELS.length) {
            updates.completedAt = Date.now();
            updates.currentTypist = null; // No typist needed if game is over
            updates.lastSuccessMemeUrl = null; // Don't show success meme if game finished
            updates[`shownSuccessMemes/${level}`] = null; // Clear success memes history for this level
        }

        update(ref(db, `game_sessions/${sessionId}`), updates);
    };

    if (!gameState) {
        return <p className="text-center">Loading game state...</p>;
    }
    
    if (level > LEVELS.length) {
        const teamNames = Object.values(players).map((p: any) => p.name).join(', ');
        return (
            <div className="text-center">
                <h1 className="text-3xl">Game Complete!</h1>
                <p>Team: {teamNames}</p>
                <p>Final Score: {gameState.score}</p>
            </div>
        );
    }
    
    if (!currentLevelData) {
        return <p className="text-center">Waiting for level data...</p>;
    }

    const myClue = currentLevelData.clues[myPlayerIndex % currentLevelData.clues.length];

    return (
        <div>
            {currentMemeDisplayUrl && <MemePlayer videoUrl={currentMemeDisplayUrl} onClose={handleCloseMeme} />}
            {gameState && <TeamStatsHUD gameState={gameState} />}
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
        </div>
    );
};

export default Game;