import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update } from 'firebase/database';
import GameStats from './GameStats';
import Leaderboard from './Leaderboard';

interface WaitingPlayer {
    uid: string;
    name: string;
    joinedAt: number;
}

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const PlayerControls: React.FC<{ waitingPlayers: WaitingPlayer[] }> = ({ waitingPlayers }) => {
    const [teamSize, setTeamSize] = useState(3);

    const handleStartGame = () => {
        if (waitingPlayers.length < teamSize) {
            alert("Not enough players to form a team.");
            return;
        }

        const shuffledPlayers = shuffleArray([...waitingPlayers]);
        const updates: { [key: string]: any } = {};
        let playersToKeepInLobby: { [key: string]: any } = {};
        
        while (shuffledPlayers.length >= teamSize) {
            const team = shuffledPlayers.splice(0, teamSize);
            const teamPlayers: { [key: string]: { uid: string, name: string } } = {};
            team.forEach(player => {
                teamPlayers[player.uid] = { uid: player.uid, name: player.name };
            });

            // Randomly select the first typist for the new team
            const firstTypist = team[Math.floor(Math.random() * team.length)];

            const newGameSession = {
                players: teamPlayers,
                level: 1,
                createdAt: Date.now(),
                score: 0,
                currentTypist: firstTypist.uid, // Set the initial typist
            };

            const newSessionId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            updates[`/game_sessions/${newSessionId}`] = newGameSession;
        }

        shuffledPlayers.forEach(player => {
            playersToKeepInLobby[player.uid] = {
                name: player.name,
                joinedAt: player.joinedAt,
            };
        });
        
        updates['/lobby/waiting_players'] = playersToKeepInLobby;

        update(ref(db), updates);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Players ({waitingPlayers.length} waiting)</h2>
            <div className="mb-4 min-h-[100px]">
                {waitingPlayers.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {waitingPlayers.map(player => <li key={player.uid}>{player.name}</li>)}
                    </ul>
                ) : (
                    <p>No players are currently waiting in the lobby.</p>
                )}
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
                <h2 className="text-xl font-semibold mb-2">Game Controls</h2>
                <label htmlFor="team-size" className="mr-2">Team Size:</label>
                <input
                    type="number"
                    id="team-size"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Math.max(2, parseInt(e.target.value, 10)))}
                    className="p-1 border rounded bg-gray-900 w-20"
                />
                <button
                    onClick={handleStartGame}
                    disabled={waitingPlayers.length < teamSize}
                    className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded ml-4 disabled:bg-gray-500"
                >
                    Start Game & Form Teams
                </button>
                {waitingPlayers.length > 0 && waitingPlayers.length < teamSize &&
                    <p className="text-sm text-yellow-400 mt-2">
                        You need at least {teamSize} players in the lobby to start.
                    </p>
                }
            </div>
        </div>
    );
};


const AdminPage: React.FC = () => {
    const [waitingPlayers, setWaitingPlayers] = useState<WaitingPlayer[]>([]);

    useEffect(() => {
        const lobbyRef = ref(db, 'lobby/waiting_players');
        const unsubscribe = onValue(lobbyRef, (snapshot) => {
            const data = snapshot.val();
            const players = data ? Object.keys(data).map(uid => ({ uid, ...data[uid] })).sort((a, b) => a.joinedAt - b.joinedAt) : [];
            setWaitingPlayers(players);
        });
        return () => unsubscribe();
    }, []);
    
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
            <PlayerControls waitingPlayers={waitingPlayers} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Active Teams</h2>
                    <GameStats />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
