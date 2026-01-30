import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo, runTransaction } from 'firebase/database';
import Game from './Game';

interface LobbyProps {
    uid: string;
}

const Lobby: React.FC<LobbyProps> = ({ uid }) => {
    const [isFinding, setIsFinding] = useState(false);
    const [gameSessionId, setGameSessionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFindGame = async () => {
        setIsFinding(true);
        setError(null);
        const dbRef = ref(db); // Run transaction on the root to modify multiple locations

        try {
            await runTransaction(dbRef, (currentData) => {
                if (!currentData) {
                    // If the entire database is empty
                    return { lobby: { waiting_player: uid } };
                }

                const lobby = currentData.lobby || {};
                const waitingPlayerId = lobby.waiting_player;

                if (!waitingPlayerId || waitingPlayerId === uid) {
                    // Lobby is empty or the current player is already the one waiting
                    currentData.lobby = { ...lobby, waiting_player: uid };
                    return currentData;
                }

                // A player is waiting, let's pair them up
                const player1Id = waitingPlayerId;
                const player2Id = uid;

                const newGameSession = {
                    players: {
                        [player1Id]: true,
                        [player2Id]: true,
                    },
                    level: 1, // Start at level 1
                    createdAt: Date.now(),
                };

                // Use a unique ID for the session
                const newSessionId = player1Id; // Using one of the player IDs is simple, but not perfectly unique
                currentData.game_sessions = currentData.game_sessions || {};
                currentData.game_sessions[newSessionId] = newGameSession;

                // Clear the waiting player from the lobby
                currentData.lobby.waiting_player = null;

                return currentData;
            });
        } catch (e) {
            setError("Could not find a game. Please try again.");
            console.error("Firebase transaction failed: ", e);
            setIsFinding(false);
        }
    };

    useEffect(() => {
        if (!uid) return;

        // Listen for a game session to be created for the current player
        const sessionsRef = query(ref(db, 'game_sessions'), orderByChild(`players/${uid}`), equalTo(true));
        const unsubscribe = onValue(sessionsRef, (snapshot) => {
            if (snapshot.exists()) {
                const sessions = snapshot.val();
                const sessionId = Object.keys(sessions)[0];
                setGameSessionId(sessionId);
                setIsFinding(false);
            }
        });

        return () => unsubscribe();
    }, [uid]);


    if (gameSessionId) {
        return <Game uid={uid} sessionId={gameSessionId} />;
    }

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Cyber Escape Room</h1>
            <p className="mb-8">Your Player ID: {uid}</p>
            {isFinding ? (
                <div>
                    <p className="text-xl animate-pulse">Searching for another agent...</p>
                    <p className="text-sm text-gray-400">(If you're the first one here, another player needs to join to start the game)</p>
                </div>
            ) : (
                <button
                    onClick={handleFindGame}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Find Game
                </button>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default Lobby;
