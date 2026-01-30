import React, { useState } from 'react';

interface TeamStatsHUDProps {
    gameState: any; // The full game state from Firebase
}

const TeamStatsHUD: React.FC<TeamStatsHUDProps> = ({ gameState }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
            <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="font-orbitron bg-cyan-500/80 hover:bg-cyan-400 text-slate-900 font-bold py-1 px-3 rounded-md transition-all duration-300"
                    title="Show Team Stats"
                >
                    HUD
                </button>
            </div>
        );
    }

    const teamNames = Object.values(gameState.players || {}).map((p: any) => p.name).join(', ');

    return (
        <div className="fixed top-2 right-2 md:top-4 md:right-4 z-40 bg-slate-900/70 border border-cyan-400/30 rounded-lg p-3 md:p-4 w-64 md:w-72 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-orbitron text-lg font-bold text-cyan-300">MISSION STATS</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-cyan-300 hover:text-white text-2xl"
                    title="Hide"
                >
                    &times;
                </button>
            </div>
            <div className="text-sm">
                <p className="text-slate-400">Team: <span className="font-bold text-slate-200">{teamNames}</span></p>
                <p className="text-slate-400">Sequence: <span className="font-bold text-slate-200">{gameState.level}</span></p>
                <p className="text-slate-400">Score: <span className="font-bold text-slate-200">{gameState.score || 0}</span></p>
            </div>
        </div>
    );
};

export default TeamStatsHUD;
