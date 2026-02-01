import React from 'react';

interface GameEndScreenProps {
    uid: string;
}

const GameEndScreen: React.FC<GameEndScreenProps> = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl text-center">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Main content */}
                <div className="relative z-10">
                    <div className="bg-slate-800/60 border border-cyan-400/30 rounded-lg p-8 md:p-12 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                        {/* Terminal-style header */}
                        <div className="text-left text-cyan-400 font-mono text-sm mb-8">
                            <div>[CYBER-TREASURE-HUNT TERMINAL]</div>
                            <div>[MISSION STATUS: COMPLETED]</div>
                            <div>[SECURITY PROTOCOL: ACTIVE]</div>
                        </div>

                        {/* Main message */}
                        <h1 className="font-orbitron text-2xl md:text-4xl font-bold mb-6 text-cyan-300 animate-pulse">
                            ESTABLISHING SECURE CONNECTION...
                        </h1>
                        
                        {/* Animated dots */}
                        <div className="flex justify-center space-x-2 mb-8">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-8">
                            <div 
                                className="bg-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Terminal messages */}
                        <div className="text-left text-slate-300 font-mono text-sm space-y-2">
                            <div className="animate-fade-in">&gt; Initializing secure protocols...</div>
                            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>&gt; Encrypting mission data...</div>
                            <div className="animate-fade-in" style={{ animationDelay: '1s' }}>&gt; Purging temporary files...</div>
                            <div className="animate-fade-in" style={{ animationDelay: '1.5s' }}>&gt; Connection established successfully.</div>
                            <div className="animate-fade-in" style={{ animationDelay: '2s' }}>&gt;<span className="text-green-400">✓</span> Mission data secured.</div>
                        </div>

                        {/* Final message */}
                        <div className="mt-8 text-slate-400">
                            <p className="text-lg">
                                Thank you for participating in the Cyber Treasure Hunt.
                            </p>
                            <p className="text-sm mt-2">
                                All operational data has been securely transmitted and stored.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default GameEndScreen;