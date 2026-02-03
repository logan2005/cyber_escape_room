import React from 'react';
import GlassPanel from './ui/GlassPanel';

interface GameEndScreenProps {
    uid: string;
}

const GameEndScreen: React.FC<GameEndScreenProps> = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <GlassPanel
                    glowing
                    neonColor="green"
                    title="🔐 MISSION COMPLETE"
                    icon="✓"
                    floating
                    className="w-full"
                >
                    <div className="space-y-8">
                        {/* Main message */}
                        <div className="text-center">
                            <div className="animate-pulse mb-6">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center animate-glow">
                                    <span className="text-5xl">🔐</span>
                                </div>
                                <h1 className="font-orbitron text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                                    ESTABLISHING SECURE CONNECTION...
                                </h1>
                                
                                {/* Animated dots */}
                                <div className="flex justify-center space-x-3 mb-8">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 bg-green-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.2}s` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-800/60 rounded-full h-4 mb-8 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-4 rounded-full transition-all duration-3000 ease-out"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        {/* Terminal output */}
                        <GlassPanel neonColor="green" className="w-full">
                            <div className="font-mono text-sm space-y-3 text-slate-300">
                                <div className="flex items-center space-x-2">
                                    <span className="text-green-400 font-bold">$</span>
                                    <span>system_status --check</span>
                                </div>
                                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                    <span className="text-cyan-400">&gt;</span> Initializing secure protocols...
                                    <span className="text-green-400 ml-2">✓ OK</span>
                                </div>
                                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                                    <span className="text-cyan-400">&gt;</span> Encrypting mission data...
                                    <span className="text-green-400 ml-2">✓ OK</span>
                                </div>
                                <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
                                    <span className="text-cyan-400">&gt;</span> Purging temporary files...
                                    <span className="text-green-400 ml-2">✓ OK</span>
                                </div>
                                <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
                                    <span className="text-cyan-400">&gt;</span> Connection established successfully...
                                    <span className="text-green-400 ml-2">✓ SECURE</span>
                                </div>
                                <div className="animate-fade-in" style={{ animationDelay: '1.5s' }}>
                                    <span className="text-cyan-400">&gt;</span> Mission data secured...
                                    <span className="text-green-400 ml-2 font-bold">✓ COMPLETE</span>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Final message */}
                        <div className="text-center bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl p-6 border border-green-400/30">
                            <div className="space-y-3">
                                <h3 className="font-orbitron text-xl font-bold text-green-400">
                                    🎯 OPERATION SUCCESSFUL
                                </h3>
                                <p className="text-slate-300">
                                    Thank you for participating in the Cyber Treasure Hunt.
                                </p>
                                <p className="text-slate-400 text-sm">
                                    All operational data has been securely transmitted and stored.
                                </p>
                                
                                {/* Connection status indicators */}
                                <div className="flex justify-center space-x-6 mt-4 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-400">ENCRYPTED</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        <span className="text-cyan-400">TRANSMITTED</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                        <span className="text-purple-400">SECURED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cyber grid overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-5 rounded-2xl">
                            <div className="w-full h-full" style={{
                                backgroundImage: `
                                    linear-gradient(rgba(0, 255, 0, 0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0, 255, 0, 0.3) 1px, transparent 1px)
                                `,
                                backgroundSize: '30px 30px',
                                animation: 'cyberRotate 30s linear infinite'
                            }} />
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default GameEndScreen;