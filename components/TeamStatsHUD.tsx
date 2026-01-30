import React, { useState } from 'react';

interface TeamStatsHUDProps {
    gameState: any; // The full game state from Firebase
}

const TeamStatsHUD: React.FC<TeamStatsHUDProps> = ({ gameState }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
                    title="Show Team Stats"
                >
                    Stats
                </button>
            </div>
        );
    }

    const teamNames = Object.values(gameState.players || {}).map((p: any) => p.name).join(', ');

    return (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white p-4 rounded-lg w-64 shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Team Stats</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                    title="Hide"
                >
                    &times;
                </button>
            </div>
            <div>
                <p><strong>Team:</strong> {teamNames}</p>
                <p><strong>Level:</strong> {gameState.level}</p>
                <p><strong>Score:</strong> {gameState.score || 0}</p>
            </div>
        </div>
    );
};

export default TeamStatsHUD;
