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

            const firstTypist = team[Math.floor(Math.random() * team.length)];
            const newGameSession = {
                players: teamPlayers,
                level: 1,
                createdAt: Date.now(),
                score: 0,
                currentTypist: firstTypist.uid,
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
        <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-4 md:p-6 mb-6 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
            <h2 className="font-orbitron text-2xl font-semibold mb-4 text-cyan-300">OPERATOR CONTROLS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-semibold mb-2">Waiting Agents ({waitingPlayers.length})</h3>
                    <div className="bg-slate-800/50 p-3 rounded-md min-h-[120px] text-slate-300">
                        {waitingPlayers.length > 0 ? (
                            <ul className="space-y-1">
                                {waitingPlayers.map(player => <li key={player.uid}>{player.name}</li>)}
                            </ul>
                        ) : (
                            <p>Staging area is empty. Awaiting new agents.</p>
                        )}
                    </div>
                </div>
                <div className="border-t border-slate-700 md:border-t-0 md:border-l md:pl-6">
                    <h3 className="text-xl font-semibold mb-2">Mission Parameters</h3>
                    <label htmlFor="team-size" className="mr-2 text-slate-300">Squad Size:</label>
                    <input
                        type="number"
                        id="team-size"
                        value={teamSize}
                        onChange={(e) => setTeamSize(Math.max(2, parseInt(e.target.value, 10)))}
                        className="p-2 bg-slate-800 border border-slate-700 rounded-md w-24 text-center text-cyan-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                        onClick={handleStartGame}
                        disabled={waitingPlayers.length < teamSize}
                        className="font-orbitron bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md ml-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 disabled:bg-slate-600 disabled:shadow-none"
                    >
                        DEPLOY TEAMS
                    </button>
                    {waitingPlayers.length > 0 && waitingPlayers.length < teamSize &&
                        <p className="text-sm text-yellow-400 mt-2">
                            Insufficient agents for a squad of {teamSize}.
                        </p>
                    }
                </div>
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
        <div className="w-full max-w-7xl mx-auto">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-6 text-center text-cyan-300">ADMINISTRATOR DASHBOARD</h1>
            <PlayerControls waitingPlayers={waitingPlayers} />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-4 md:p-6 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
                    <h2 className="font-orbitron text-2xl font-bold mb-4 text-cyan-300">ACTIVE MISSIONS</h2>
                    <GameStats />
                </div>
                <div className="bg-slate-900/70 border border-cyan-400/30 rounded-lg p-4 md:p-6 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
                    <h2 className="font-orbitron text-2xl font-bold mb-4 text-cyan-300">AGENT RANKINGS</h2>
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
