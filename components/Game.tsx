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

interface DisplayMessage {
    text: string;
    type: 'success' | 'failure';
}

const AudioPlayer: React.FC<{ src: string; onClick: () => void }> = ({ src, onClick }) => (
    <div
        className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-lg transition-shadow"
        onClick={onClick}
        title="Knock, and it shall be opened..."
    >
        <h2 className="font-orbitron text-lg text-cyan-400 mb-2">AUDITORY CLUE // LISTEN CAREFULLY</h2>
        <audio controls loop autoPlay src={src} className="w-full" />
    </div>
);


const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
    const [gameState, setGameState] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [currentMessage, setCurrentMessage] = useState<DisplayMessage | null>(null);
    const [currentMemeDisplayUrl, setCurrentMemeDisplayUrl] = useState<string | null>(null);

    useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            const data = snapshot.val();
            setGameState(data);

            if (data?.lastSuccessMemeUrl) {
                setCurrentMemeDisplayUrl(data.lastSuccessMemeUrl);
            } else if (data?.lastFailureMemeUrl) {
                setCurrentMemeDisplayUrl(data.lastFailureMemeUrl);
            } else {
                setCurrentMemeDisplayUrl(null);
            }

            if (currentMemeDisplayUrl === null) { 
                if (data?.lastSuccessText) {
                    setCurrentMessage({ text: data.lastSuccessText, type: 'success' });
                } else if (data?.lastFailureText) {
                    setCurrentMessage({ text: data.lastFailureText, type: 'failure' });
                } else {
                    setCurrentMessage(null);
                }
            } else {
                setCurrentMessage(null);
            }
        });
        return () => unsubscribe();
    }, [sessionId, currentMemeDisplayUrl]);

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
            setAnswer('');
        } else {
            triggerFailMeme();
        }
    };

    const triggerFailMeme = () => {
        let shownMemesForLevel = shownMemes?.[level] || [];
        let availableMemes = FAIL_MEME_VIDEOS.filter(meme => !shownMemesForLevel.includes(meme));

        if (availableMemes.length === 0) {
            availableMemes = FAIL_MEME_VIDEOS;
            shownMemesForLevel = [];
        }

        const randomMeme = availableMemes[Math.floor(Math.random() * availableMemes.length)];
        
        const updates = { 
            lastFailureMemeUrl: randomMeme, 
            [`shownMemes/${level}`]: [...shownMemesForLevel, randomMeme],
            lastFailureText: 'ACCESS DENIED. Anomaly detected. Re-evaluate strategy.',
            lastSuccessText: null,
        };
        update(ref(db, `game_sessions/${sessionId}`), updates);
    };

    const handleCloseMeme = () => {
        setCurrentMemeDisplayUrl(null);
        update(ref(db, `game_sessions/${sessionId}`), { 
            lastFailureMemeUrl: null,
            lastSuccessMemeUrl: null,
            lastFailureText: null,
            lastSuccessText: null,
        });
    };

    const advanceLevel = () => {
        const nextLevel = level + 1;
        const nextTypistIndex = (level) % sortedPlayerIds.length;
        const nextTypistId = sortedPlayerIds[nextTypistIndex];
        
        let shownSuccessMemesForLevel = shownSuccessMemes?.[level] || [];
        let availableSuccessMemes = SUCCESS_MEME_VIDEOS.filter(meme => !shownSuccessMemesForLevel.includes(meme));
        if (availableSuccessMemes.length === 0) {
            availableSuccessMemes = SUCCESS_MEME_VIDEOS;
            shownSuccessMemesForLevel = [];
        }
        const randomSuccessMeme = availableSuccessMemes[Math.floor(Math.random() * availableSuccessMemes.length)];

        const updates: { [key: string]: any } = {
            level: nextLevel,
            score: (gameState.score || 0) + 100,
            lastLevelCompletedAt: Date.now(),
            currentTypist: nextTypistId,
            lastFailureMemeUrl: null,
            lastFailureText: null,
            [`shownMemes/${level}`]: null,
            lastSuccessMemeUrl: randomSuccessMeme,
            [`shownSuccessMemes/${level}`]: [...shownSuccessMemesForLevel, randomSuccessMeme],
            lastSuccessText: 'SEQUENCE DECRYPTED! Advancing to next phase.',
        };

        if (level === LEVELS.length) {
            updates.completedAt = Date.now();
            updates.currentTypist = null;
            updates.lastSuccessMemeUrl = null;
            updates[`shownSuccessMemes/${level}`] = null;
            updates.lastSuccessText = 'MISSION OBJECTIVE ACHIEVED! All sequences decrypted.';
        }
        update(ref(db, `game_sessions/${sessionId}`), updates);
    };

    const handleAudioClick = () => {
        console.log("Audio player clicked! Waiting for user clarification on what should happen.");
    };

    const renderContent = () => {
        if (!gameState) {
            return <p className="text-center animate-pulse text-cyan-300">Establishing secure connection to game server...</p>;
        }
    
        if (level > LEVELS.length) {
            const teamNames = Object.values(players).map((p: any) => p.name).join(', ');
            return (
                <div className="text-center">
                    <h1 className="font-orbitron text-3xl md:text-4xl text-cyan-300 mb-4">MISSION COMPLETE</h1>
                    <p className="text-lg text-slate-300">Team <span className="font-bold text-white">{teamNames}</span> has successfully infiltrated the system.</p>
                    <p className="text-2xl text-white mt-4">Final Score: <span className="font-bold text-cyan-300">{gameState.score}</span></p>
                </div>
            );
        }
        
        if (!currentLevelData) {
            return <p className="text-center animate-pulse text-cyan-300">Decrypting level data...</p>;
        }

        const myClue = currentLevelData.clues[myPlayerIndex % currentLevelData.clues.length];
        
        const messageColor = currentMessage?.type === 'success' ? 'text-green-400' : 'text-red-400';

        return (
            <>
                {currentMessage && (
                    <p className={`font-orbitron text-lg font-bold mb-4 ${messageColor}`}>
                        {currentMessage.text}
                    </p>
                )}
                <h1 className="font-orbitron text-2xl md:text-3xl text-cyan-300 mb-2">SEQUENCE {level}</h1>
                <p className="text-lg text-slate-300 mb-6">{currentLevelData.question}</p>

                {level === 1 && currentLevelData.audioClue && (
                    <AudioPlayer src={currentLevelData.audioClue} onClick={handleAudioClick} />
                )}

                <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4">
                    <h2 className="font-orbitron text-lg text-cyan-400 mb-2">DATA FRAGMENT // AGENT_{uid.substring(0,4)}</h2>
                    <p className="text-2xl font-mono text-white animate-pulse">{myClue || "No text clue assigned for this sequence."}</p>
                </div>

                <div className="my-6">
                    <p className="text-slate-300">Designated typist for this sequence: <span className="font-bold text-white">{players[currentTypist]?.name || '...'}</span></p>
                </div>
                
                {amITypist && (
                    <div className="mt-6">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                            placeholder="INPUT DECRYPTION KEY"
                            className="font-orbitron p-3 bg-slate-800 border border-slate-700 rounded-md w-full max-w-sm mb-2 text-center text-lg text-cyan-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                            onClick={handleSubmitAnswer}
                            className="font-orbitron bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-md w-full max-w-sm text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
                        >
                            EXECUTE
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <div>
            {currentMemeDisplayUrl && <MemePlayer videoUrl={currentMemeDisplayUrl} onClose={handleCloseMeme} />}
            {gameState && <TeamStatsHUD gameState={gameState} />}
            <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                {renderContent()}
            </div>
        </div>
    );
};

export default Game;