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
        const currentLevel = gameState.level;
        if (currentLevel >= TOTAL_LEVELS + 1) return;

        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const updates: { [key: string]: any } = {
            level: currentLevel + 1,
            score: (gameState.score || 0) + 100,
            lastLevelCompletedAt: Date.now(),
        };

        if (currentLevel === TOTAL_LEVELS) {
            updates.completedAt = Date.now();
        }

        update(sessionRef, updates);
    };

    const renderLevel = () => {
        if (!gameState) {
            return <p>Loading game...</p>;
        }

        const teamNames = Object.values(gameState.players).map((p: any) => p.name).join(', ');

        const props = {
            onComplete: handleComplete,
            playerName: teamNames, // Pass the team names string
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
            case 6: return <GameComplete playerName={teamNames} />;
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
