import React, { useEffect, useState } from 'react';

interface AttackPreventedProps {
    attackType: string;
    attackerName?: string;
    onDismiss: () => void;
    message?: string;
}

const AttackPrevented: React.FC<AttackPreventedProps> = ({ attackType, attackerName, onDismiss, message }) => {
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(onDismiss, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

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

    return (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-900/90 border border-green-400/50 rounded-lg p-6 shadow-2xl backdrop-blur-sm ${isFading ? 'opacity-0 transition-opacity duration-500' : ''}`}>
            <div className="flex flex-col items-center space-y-3">
                <div className="text-4xl animate-pulse">🛡️</div>
                        <h3 className="font-orbitron text-green-300 text-lg font-bold text-center">
                            {message || 'FIREWALL SHIELD ACTIVATED!'}
                        </h3>
                <p className="text-sm text-white text-center">
                    {getAttackName(attackType)} blocked
                </p>
                {attackerName && (
                    <p className="text-xs text-green-200 text-center">
                        From: {attackerName}
                    </p>
                )}
                <div className="mt-3 w-16 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
};

export default AttackPrevented;