import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { LEVELS } from '../levels';
import { FAIL_MEME_VIDEOS, SUCCESS_MEME_VIDEOS } from '../constants';
import TeamStatsHUD from './TeamStatsHUD';
import SecretPayload from './SecretPayload';
import SuccessScreen from './SuccessScreen';
import FailureScreen from './FailureScreen';

interface GameProps {
    uid: string;
    sessionId: string;
}

const AudioPlayer: React.FC<{ src: string; onClick: () => void }> = ({ src, onClick }) => (
    <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4 cursor-pointer hover:shadow-cyan-500/50 hover:shadow-lg transition-shadow" onClick={onClick} title="Knock, and it shall be opened...">
        <h2 className="font-orbitron text-lg text-cyan-400 mb-2">AUDITORY CLUE // LISTEN CAREFULLY</h2>
        <audio controls loop src={src} className="w-full" />
    </div>
);

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => (
    <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4">
        <h2 className="font-orbitron text-lg text-cyan-400 mb-2">VIDEO EVIDENCE // ANALYZE CAREFULLY</h2>
        <video controls src={src} className="w-full rounded" />
    </div>
);

const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
    const [gameState, setGameState] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [revealedClueText, setRevealedClueText] = useState<string | null>(null);

    useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            setGameState(snapshot.val());
        });
        return () => unsubscribe();
    }, [sessionId]);

    useEffect(() => {
        if (gameState?.level === 5 && gameState?.level5ClueTriggeredAt && LEVELS[4]?.timedClue) {
            const timedClue = LEVELS[4].timedClue;
            const revealTime = gameState.level5ClueTriggeredAt + (timedClue.delay * 1000);
            const interval = setInterval(() => {
                const timeRemaining = revealTime - Date.now();
                if (timeRemaining <= 0) {
                    setCountdown(0);
                    setRevealedClueText(timedClue.text);
                    clearInterval(interval);
                } else {
                    setCountdown(Math.ceil(timeRemaining / 1000));
                }
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCountdown(null);
            setRevealedClueText(null);
        }
    }, [gameState?.level, gameState?.level5ClueTriggeredAt]);

    const { level, players, currentTypist, secretPayloadState, currentView, activeMemeUrl } = gameState || {};

    const { amITypist, myPlayerIndex, sortedPlayerIds } = useMemo<{ amITypist: boolean; myPlayerIndex: number; sortedPlayerIds: string[] }>(() => {
        if (!players || !uid) return { amITypist: false, myPlayerIndex: -1, sortedPlayerIds: [] };
        const sortedIds = Object.keys(players).sort();
        const myIndex = sortedIds.indexOf(uid);
        const isTypist = currentTypist === uid;
        return { amITypist: isTypist, myPlayerIndex: myIndex, sortedPlayerIds: sortedIds };
    }, [players, uid, currentTypist]);

    useEffect(() => {
        if (amITypist && sortedPlayerIds.length > 0 && level <= LEVELS.length) {
            const jumpInterval = setInterval(() => {
                const currentPayloadHolderId = gameState?.secretPayloadState?.visibleTo || sortedPlayerIds[0];
                const currentHolderIndex = sortedPlayerIds.indexOf(currentPayloadHolderId);
                const nextHolderIndex = (currentHolderIndex + 1) % sortedPlayerIds.length;
                const nextHolderId = sortedPlayerIds[nextHolderIndex];
                const newPayloadState = {
                    visibleTo: nextHolderId,
                    position: {
                        top: `${Math.floor(Math.random() * 80) + 10}%`,
                        left: `${Math.floor(Math.random() * 80) + 10}%`,
                    },
                };
                update(ref(db, `game_sessions/${sessionId}/secretPayloadState`), newPayloadState);
            }, 5000);
            return () => clearInterval(jumpInterval);
        }
    }, [amITypist, sortedPlayerIds, sessionId, gameState?.secretPayloadState, level]);

    const currentLevelData = level > 0 && level <= LEVELS.length ? LEVELS[level - 1] : null;

    const handleSubmitAnswer = () => {
        if (!currentLevelData) return;
        const updates: { [key: string]: any } = {};

        if (answer.trim().toLowerCase() === currentLevelData.answer.toLowerCase()) {
            updates.currentView = 'success';
            updates.activeMemeUrl = SUCCESS_MEME_VIDEOS[Math.floor(Math.random() * SUCCESS_MEME_VIDEOS.length)];
        } else {
            updates.currentView = 'failure';
            updates.activeMemeUrl = FAIL_MEME_VIDEOS[Math.floor(Math.random() * FAIL_MEME_VIDEOS.length)];
        }
        update(ref(db, `game_sessions/${sessionId}`), updates);
    };
    
    const handleTryAgain = () => {
        update(ref(db, `game_sessions/${sessionId}`), { currentView: 'playing', activeMemeUrl: '' });
        setAnswer('');
    };

    const advanceLevel = () => {
        const nextLevel = level + 1;
        const nextTypistIndex = (level) % sortedPlayerIds.length;
        const nextTypistId = sortedPlayerIds[nextTypistIndex];
        
        const updates: { [key: string]: any } = {
            level: nextLevel,
            score: (gameState.score || 0) + 100,
            lastLevelCompletedAt: Date.now(),
            currentTypist: nextTypistId,
            level5ClueTriggeredAt: null,
            secretPayloadState: null,
            currentView: 'playing',
            activeMemeUrl: '',
        };

        if (nextLevel > LEVELS.length) {
            updates.completedAt = Date.now();
            updates.currentTypist = null;
        }

        update(ref(db, `game_sessions/${sessionId}`), updates);
        setAnswer('');
    };

    const handleAudioClick = () => console.log("Audio player clicked!");
    const handleTriggerTimedClue = () => {
        if (level === 5 && currentLevelData?.timedClue && !gameState?.level5ClueTriggeredAt) {
            update(ref(db, `game_sessions/${sessionId}`), { level5ClueTriggeredAt: Date.now() });
        }
    };

    const renderPlayingView = () => {
        if (!gameState || !currentLevelData) { return <p className="text-center animate-pulse text-cyan-300">Establishing secure connection...</p>; }
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
        
        const myClueIndex = myPlayerIndex % currentLevelData.clues.length;
        const myClue = currentLevelData.clues[myClueIndex];

        return (
            <>
                <h1 className="font-orbitron text-2xl md:text-3xl text-cyan-300 mb-2">SEQUENCE {level}</h1>
                <p className="text-lg text-slate-300 mb-6">{currentLevelData.question}</p>
                {currentLevelData.audioClue && ( <AudioPlayer src={currentLevelData.audioClue} onClick={handleAudioClick} /> )}
                {currentLevelData.videoClue && ( <VideoPlayer src={currentLevelData.videoClue} /> )}
                {level === 5 && currentLevelData.timedClue && !gameState?.level5ClueTriggeredAt && (
                    <div className="text-center my-6">
                        <button onClick={handleTriggerTimedClue} className="font-orbitron bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-md text-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50">
                            INITIATE CLUE DECRYPTION
                        </button>
                    </div>
                )}
                {level === 5 && currentLevelData.timedClue && gameState?.level5ClueTriggeredAt && (
                    <div className="bg-slate-900 border border-amber-400/30 p-4 rounded-lg my-4 text-center">
                        <h2 className="font-orbitron text-lg text-amber-400 mb-2">TIME-LOCKED CLUE // STATUS: {revealedClueText ? 'DECRYPTED' : 'PENDING'}</h2>
                        {revealedClueText ? ( <p className="text-2xl font-mono text-amber-200 animate-pulse">{revealedClueText}</p> ) : ( <p className="text-2xl font-mono text-amber-200 animate-pulse">REVEALING IN... {countdown}s</p> )}
                    </div>
                )}
                <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4">
                    <h2 className="font-orbitron text-lg text-cyan-400 mb-2">DATA FRAGMENT {myClueIndex + 1} // AGENT_{uid.substring(0,4)}</h2>
                    <p className="text-2xl font-mono text-white animate-pulse">{myClue}</p>
                </div>
                <div className="my-6">
                    <p className="text-slate-300">Designated typist: <span className="font-bold text-white">{players[currentTypist]?.name || '...'}</span></p>
                </div>
                {amITypist && (
                    <div className="mt-6">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()} placeholder="INPUT DECRYPTION KEY" className="font-orbitron p-3 bg-slate-800 border border-slate-700 rounded-md w-full max-w-sm mb-2 text-center text-lg text-cyan-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none focus:border-cyan-400" />
                        <button onClick={handleSubmitAnswer} className="font-orbitron bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-md w-full max-w-sm text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                            EXECUTE
                        </button>
                    </div>
                )}
            </>
        );
    };

    if (currentView === 'success') {
        return <SuccessScreen memeUrl={activeMemeUrl} onProceed={advanceLevel} />;
    }
    if (currentView === 'failure') {
        return <FailureScreen memeUrl={activeMemeUrl} onTryAgain={handleTryAgain} />;
    }

    return (
        <div>
            {gameState && <TeamStatsHUD gameState={gameState} />}
            {secretPayloadState?.visibleTo === uid && currentLevelData?.secretEncodings &&
                <SecretPayload 
                    text={currentLevelData.secretEncodings[myPlayerIndex % currentLevelData.secretEncodings.length]} 
                    position={secretPayloadState.position} 
                />
            }
            <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                {renderPlayingView()}
            </div>
        </div>
    );
};

export default Game;