import React, { useEffect, useState } from 'react';

interface AttackReceived3DProps {
    attackType: string;
    attackerTeamName: string;
    onDismiss: () => void;
}

const AttackReceived3D: React.FC<AttackReceived3DProps> = ({ attackType, attackerTeamName, onDismiss }) => {
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(onDismiss, 500);
        }, 30000); // Auto-dismiss after 30 seconds

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const getAttackColor = (type: string) => {
        switch (type) {
            case 'TIME_DRAIN': return 'from-blue-600 to-blue-800';
            case 'DISCONNECT': return 'from-red-600 to-red-800';
            case 'INPUT_DELAY': return 'from-yellow-600 to-yellow-800';
            case 'SYSTEM_GLITCH': return 'from-purple-600 to-purple-800';
            case 'DOUBLE_AGENT': return 'from-orange-600 to-orange-800';
            case 'REALITY_FLIP': return 'from-green-600 to-green-800';
            case 'RESET_TEAM': return 'from-gray-600 to-gray-800';
            default: return 'from-red-600 to-red-800';
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
            case 'RESET_TEAM': return 'RESET TEAM';
            default: return 'ATTACK';
        }
    };

    return (
        <div className={`fixed top-4 left-4 z-40 ${isFading ? 'opacity-0 transition-opacity duration-500' : ''}`}>
            {/* HUD-style attack received notification */}
            <div className={`bg-gradient-to-r ${getAttackColor(attackType)} rounded-lg p-4 shadow-lg backdrop-blur-sm border border-red-500/50 transform transition-all duration-300 hover:scale-105`} style={{
                minWidth: '300px',
                maxWidth: '400px'
            }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Warning Icon */}
                        <div className="text-2xl animate-pulse">
                            ⚠️
                        </div>
                        
                        <div>
                            <h3 className="font-orbitron text-sm font-bold text-white">
                                UNDER ATTACK!
                            </h3>
                            
                            <div className="bg-white/20 rounded px-2 py-1 mt-1">
                                <p className="text-xs text-white font-semibold">
                                    {getAttackName(attackType)}
                                </p>
                            </div>
                            
                            <div className="bg-black/30 rounded px-2 py-1 mt-1">
                                <p className="text-xs text-red-300">
                                    From: {attackerTeamName}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Close button */}
                    <button 
                        onClick={() => {
                            setIsFading(true);
                            setTimeout(onDismiss, 500);
                        }}
                        className="text-white/70 hover:text-white transition-colors text-lg"
                    >
                        ×
                    </button>
                </div>
                
                {/* Duration indicator */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                    <p className="text-xs text-white/60 font-orbitron">
                        30s duration
                    </p>
                </div>
            </div>
            
            {/* Small 3D effect indicator */}
            <div className="mt-2 flex space-x-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1 h-1 bg-red-500/50 rounded-full animate-ping"
                        style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default AttackReceived3D;