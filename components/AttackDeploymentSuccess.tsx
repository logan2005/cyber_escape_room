import React, { useEffect, useState } from 'react';

interface AttackDeploymentSuccessProps {
    attackType: string;
    targetTeamName: string;
    onDismiss: () => void;
    message?: string;
}

const AttackDeploymentSuccess: React.FC<AttackDeploymentSuccessProps> = ({ attackType, targetTeamName, onDismiss, message }) => {
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
            case 'RESET_TEAM': return '🔄';
            default: return '⚔️';
        }
    };

    const getAttackColor = (type: string) => {
        switch (type) {
            case 'TIME_DRAIN': return 'from-blue-500 to-blue-700';
            case 'DISCONNECT': return 'from-red-500 to-red-700';
            case 'INPUT_DELAY': return 'from-yellow-500 to-yellow-700';
            case 'SYSTEM_GLITCH': return 'from-purple-500 to-purple-700';
            case 'DOUBLE_AGENT': return 'from-orange-500 to-orange-700';
            case 'REALITY_FLIP': return 'from-green-500 to-green-700';
            case 'RESET_TEAM': return 'from-gray-500 to-gray-700';
            default: return 'from-cyan-500 to-cyan-700';
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
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${isFading ? 'opacity-0 transition-opacity duration-500' : ''}`}>
            <div className="relative">
                {/* 3D Animated Container */}
                <div className={`animate-3d-attack-deployment bg-gradient-to-br ${getAttackColor(attackType)} rounded-2xl p-8 shadow-2xl transform-gpu`} style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                }}>
                    <div className="text-center">
                        {/* Large 3D Icon */}
                        <div className="text-8xl mb-4 animate-3d-icon-float">
                            {getAttackIcon(attackType)}
                        </div>
                        
                        <h2 className="font-orbitron text-3xl font-bold text-white mb-2">
                            {message || 'ATTACK DEPLOYED!'}
                        </h2>
                        
                        <div className="bg-white/20 rounded-lg p-4 mb-4">
                            <p className="text-xl text-white font-semibold">
                                {getAttackName(attackType)}
                            </p>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-lg text-cyan-300">
                                Target: {targetTeamName}
                            </p>
                        </div>
                        
                        {/* Success indicators */}
                        <div className="flex justify-center space-x-2 mt-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* 3D Particles Effect */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/50 rounded-full animate-3d-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes 3d-attack-deployment {
                    0% {
                        transform: scale(0.5) rotateY(0deg) rotateX(0deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1) rotateY(180deg) rotateX(10deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) rotateY(360deg) rotateX(0deg);
                        opacity: 1;
                    }
                }
                
                @keyframes 3d-icon-float {
                    0%, 100% {
                        transform: translateY(0px) rotateY(0deg);
                    }
                    50% {
                        transform: translateY(-10px) rotateY(180deg);
                    }
                }
                
                @keyframes 3d-particle {
                    0% {
                        transform: translateZ(0px) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateZ(100px) scale(1);
                        opacity: 0;
                    }
                }
                
                .animate-3d-attack-deployment {
                    animation: 3d-attack-deployment 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                .animate-3d-icon-float {
                    animation: 3d-icon-float 2s ease-in-out infinite;
                }
                
                .animate-3d-particle {
                    animation: 3d-particle 2s ease-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AttackDeploymentSuccess;