import React from 'react';

interface Player {
    uid: string;
    name: string;
}

interface TeamIntroProps {
    uid: string;
    team: Player[];
    onProceed: () => void;
}

const TeamIntro: React.FC<TeamIntroProps> = ({ uid, team, onProceed }) => {
    const teammates = team.filter(player => player.uid !== uid);

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">You have been assigned to a team!</h1>
            <h2 className="text-2xl font-semibold mb-6">Your Teammates:</h2>
            
            <ul className="list-none mb-8">
                {teammates.map(player => (
                    <li key={player.uid} className="text-xl mb-2">{player.name}</li>
                ))}
            </ul>

            <button
                onClick={onProceed}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Proceed to Game
            </button>
        </div>
    );
};

export default TeamIntro;
