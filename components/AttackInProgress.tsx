import React from 'react';

interface AttackInProgressProps {
    activeAttack: {
        type: string;
        timestamp: number;
        attackerId?: string;
        target?: string;
    };
    attackerName?: string;
    targetName?: string;
}

const AttackInProgress: React.FC<AttackInProgressProps> = ({ activeAttack, attackerName, targetName }) => {
    const getAttackIcon = (type: string) => {
        switch (type) {
            case 'TIME_DRAIN': return '⏰';
            case 'DISCONNECT': return '🔌';
            case 'INPUT_DELAY': return '📱';
            case 'SYSTEM_GLITCH': return '⚡';
            case 'DOUBLE_AGENT': return '🎭';
            case 'REALITY_FLIP': return '🔄';
            default: return '⚔️';
        }
    };

    const getAttackName = (type: string) => {
        switch (type) {
            case 'TIME_DRAIN': return 'TIME DRAIN';
            case 'DISCONNECT': return 'DISCONNECT';
            case 'INPUT_DELAY': return 'INPUT DELAY';
            case 'SYSTEM_GLITCH': return 'SYSTEM GLITCH';
            case 'DOUBLE_AGENT': return 'DOUBLE AGENT';
            case 'REALITY_FLIP': return 'REALITY FLIP';
            default: return 'ATTACK';
        }
    };

    const getAttackColor = (type: string) => {
        switch (type) {
            case 'TIME_DRAIN': return 'text-blue-400';
            case 'DISCONNECT': return 'text-red-400';
            case 'INPUT_DELAY': return 'text-yellow-400';
            case 'SYSTEM_GLITCH': return 'text-purple-400';
            case 'DOUBLE_AGENT': return 'text-orange-400';
            case 'REALITY_FLIP': return 'text-green-400';
            default: return 'text-cyan-400';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-40 bg-slate-900/90 border border-cyan-400/50 rounded-lg p-4 shadow-2xl backdrop-blur-sm animate-attack-in">
            <div className="flex items-center space-x-3">
                <span className={`text-2xl ${getAttackColor(activeAttack.type)}`}>
                    {getAttackIcon(activeAttack.type)}
                </span>
                <div>
                    <h3 className="font-orbitron text-cyan-300 text-sm font-bold">
                        {getAttackName(activeAttack.type)} ACTIVE
                    </h3>
                    {attackerName && (
                        <p className="text-xs text-slate-400">
                            By: {attackerName}
                        </p>
                    )}
                    {targetName && (
                        <p className="text-xs text-slate-400">
                            Target: {targetName}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-2 w-full bg-slate-700 rounded-full h-1">
                <div className={`bg-${activeAttack.type === 'TIME_DRAIN' ? 'blue' : activeAttack.type === 'DISCONNECT' ? 'red' : activeAttack.type === 'INPUT_DELAY' ? 'yellow' : activeAttack.type === 'SYSTEM_GLITCH' ? 'purple' : activeAttack.type === 'DOUBLE_AGENT' ? 'orange' : activeAttack.type === 'REALITY_FLIP' ? 'green' : 'cyan'}-500 h-1 rounded-full animate-pulse`}></div>
            </div>
        </div>
    );
};

export default AttackInProgress;