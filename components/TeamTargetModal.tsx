import React from 'react';

interface OpponentTeam {
    sessionId: string;
    teamName: string;
}

interface TeamTargetModalProps {
    opponents: OpponentTeam[];
    onSelectTarget: (sessionId: string) => void;
    onCancel: () => void;
}

const TeamTargetModal: React.FC<TeamTargetModalProps> = ({ opponents, onSelectTarget, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-80 backdrop-blur-md">
            <div className="bg-slate-800 border border-cyan-400/30 rounded-lg p-6 shadow-lg w-full max-w-md">
                <h2 className="font-orbitron text-2xl text-cyan-300 mb-4">SELECT TARGET</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {opponents.length > 0 ? opponents.map(team => (
                        <button
                            key={team.sessionId}
                            onClick={() => onSelectTarget(team.sessionId)}
                            className="w-full p-4 bg-slate-700 rounded-md text-left text-white hover:bg-cyan-700/50 transition-colors"
                        >
                            {team.teamName}
                        </button>
                    )) : (
                        <p className="text-slate-400">No other teams currently active.</p>
                    )}
                </div>
                <button
                    onClick={onCancel}
                    className="font-orbitron mt-6 w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-md"
                >
                    CANCEL
                </button>
            </div>
        </div>
    );
};

export default TeamTargetModal;
