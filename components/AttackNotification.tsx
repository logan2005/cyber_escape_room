import React, { useEffect, useState } from 'react';

interface AttackNotificationProps {
    activeAttack: {
        type: string;
        timestamp: number;
        attackerId?: string;
        target?: string;
    };
    attackerName?: string;
    onDismiss: () => void;
}

const AttackNotification: React.FC<AttackNotificationProps> = ({ activeAttack, attackerName, onDismiss }) => {
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(onDismiss, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

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

    const getAttackAnimation = (type: string) => {
        switch (type) {
            case 'TIME_DRAIN': return 'animate-shake';
            case 'DISCONNECT': return 'animate-flash';
            case 'INPUT_DELAY': return 'animate-wiggle';
            case 'SYSTEM_GLITCH': return 'animate-glitch';
            case 'DOUBLE_AGENT': return 'animate-fade';
            case 'REALITY_FLIP': return 'animate-flip';
            default: return 'animate-pulse';
        }
    };

    return (
        <div className={`fixed top-4 left-4 z-50 bg-red-900/90 border border-red-400/50 rounded-lg p-4 shadow-2xl backdrop-blur-sm ${getAttackAnimation(activeAttack.type)} ${isFading ? 'opacity-0 transition-opacity duration-500' : ''}`}>
            <div className="flex items-center space-x-3">
                <span className="text-3xl animate-pulse">
                    {getAttackIcon(activeAttack.type)}
                </span>
                <div>
                    <h3 className="font-orbitron text-red-300 text-sm font-bold">
                        UNDER ATTACK!
                    </h3>
                    <p className="text-xs text-white">
                        {getAttackName(activeAttack.type)}
                    </p>
                    {attackerName && (
                        <p className="text-xs text-red-200">
                            By: {attackerName}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-2 flex space-x-1">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
            </div>
        </div>
    );
};

export default AttackNotification;