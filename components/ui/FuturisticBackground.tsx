import React from 'react';

const FuturisticBackground: React.FC = () => {
    const TECH_COLORS = {
        neonCyan: '#00ffff',
        neonPink: '#ff00ff',
        neonGreen: '#00ff00',
        neonYellow: '#ffff00',
        darkBg: '#0a0a0f',
        darkerBg: '#050507'
    };

    return (
        <>
            {/* Animated gradient background */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: `linear-gradient(135deg, ${TECH_COLORS.darkBg}, ${TECH_COLORS.darkerBg})`,
                zIndex: -2
            }}>
                {/* Animated overlay */}
                <div className="absolute inset-0 opacity-30" style={{
                    background: `radial-gradient(circle at 20% 50%, ${TECH_COLORS.neonCyan}22 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, ${TECH_COLORS.neonPink}22 0%, transparent 50%),
                                radial-gradient(circle at 40% 20%, ${TECH_COLORS.neonGreen}22 0%, transparent 50%)`,
                    animation: 'hologram 8s ease-in-out infinite'
                }} />
                
                {/* Floating particles */}
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full pointer-events-none"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            background: TECH_COLORS.neonCyan,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.6 + Math.random() * 0.4,
                            boxShadow: `0 0 ${5 + Math.random() * 10}px currentColor`
                        }}
                    />
                ))}
                
                {/* Cyber grid */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                        linear-gradient(${TECH_COLORS.neonCyan}33 1px, transparent 1px),
                        linear-gradient(90deg, ${TECH_COLORS.neonCyan}33 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'cyberRotate 60s linear infinite'
                }} />
            </div>

            <style>{`
                body {
                    background: ${TECH_COLORS.darkBg};
                    overflow-x: hidden;
                    margin: 0;
                    padding: 0;
                }
                @keyframes glow {
                    from { filter: drop-shadow(0 0 5px currentColor); }
                    to { filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 30px currentColor); }
                }
                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px); 
                    }
                    25% { 
                        transform: translateY(-10px) translateX(5px); 
                    }
                    50% { 
                        transform: translateY(-5px) translateX(-3px); 
                    }
                    75% { 
                        transform: translateY(-15px) translateX(2px); 
                    }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                @keyframes hologram {
                    0%, 100% { 
                        background-position: 0% 50%;
                        filter: hue-rotate(0deg);
                    }
                    50% { 
                        background-position: 100% 50%;
                        filter: hue-rotate(180deg);
                    }
                }
                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                }
                @keyframes cyberRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shine {
                    0% { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes dataStream {
                    0% { 
                        transform: translateY(0px); 
                        opacity: 0;
                    }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { 
                        transform: translateY(-20px); 
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default FuturisticBackground;