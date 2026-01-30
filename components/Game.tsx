import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { Level1, Level2, Level3, Level4, Level5, GameComplete } from './GameUI';
import { TOTAL_LEVELS } from '../constants';

interface GameProps {
    uid: string;
    sessionId: string;
}

const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
    const [gameState, setGameState] = useState<any>(null);

    useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            if (snapshot.exists()) {
                setGameState(snapshot.val());
            }
        });

        return () => unsubscribe();
    }, [sessionId]);

    const handleComplete = () => {
        if (gameState.level < TOTAL_LEVELS + 1) {
            const sessionRef = ref(db, `game_sessions/${sessionId}`);
            update(sessionRef, { level: gameState.level + 1 });
        }
    };

    const renderLevel = () => {
        if (!gameState) {
            return <p>Loading game...</p>;
        }

        const props = {
            onComplete: handleComplete,
            playerName: uid, // Use UID as player name for now
            // These props are from the old single-player game and may need to be adapted
            setPlayerName: () => {}, 
            pcAssignment: null,
            setPcAssignment: () => {},
        };

        switch (gameState.level) {
            case 1: return <Level1 {...props} />;
            case 2: return <Level2 {...props} />;
            case 3: return <Level3 {...props} />;
            case 4: return <Level4 {...props} />;
            case 5: return <Level5 {...props} />;
            case 6: return <GameComplete playerName={uid} />;
            default:
                return <p>An unknown error occurred.</p>;
        }
    };

    return (
        <div>
            {renderLevel()}
        </div>
    );
};

export default Game;
