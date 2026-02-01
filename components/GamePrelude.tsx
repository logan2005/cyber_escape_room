import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, update } from 'firebase/database';

interface GamePreludeProps {
    sessionId: string;
}

const GamePrelude: React.FC<GamePreludeProps> = ({ sessionId }) => {
    const [currentScene, setCurrentScene] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const scenes = [
        {
            title: "WELCOME TO CYBER TREASURE HUNT",
            content: "You are about to enter a high-stakes cyber operation where teams compete to complete missions and unlock digital treasures.",
            duration: 4000,
            className: "text-cyan-300"
        },
        {
            title: "TEAM FORMATION",
            content: "You have been assembled into an elite squad. Work together with your team members to outmaneuver rival teams and achieve mission objectives.",
            duration: 4000,
            className: "text-blue-400"
        },
        {
            title: "MISSION OBJECTIVES",
            content: "Complete 4 challenging levels to face the final BOSS. Conquer all 5 levels to achieve victory. Your team must work together to solve each cyber puzzle.",
            duration: 5000,
            className: "text-green-400"
        },
        {
            title: "POWERUP ARSENAL",
            content: "Collect and deploy powerful cyber abilities to gain tactical advantages. Use them wisely to dominate the battlefield.",
            duration: 4000,
            className: "text-yellow-400"
        },
        {
            title: "ATTACK SYSTEMS",
            content: [
                "TIME_DRAIN: Slows opponent typing speed",
                "DISCONNECT: Forces opponent to reconnect",
                "INPUT_DELAY: Adds latency to opponent inputs",
                "SYSTEM_GLITCH: Creates visual interference",
                "DOUBLE_AGENT: 50% attack, 50% backfire chance",
                "REALITY_FLIP: Inverts opponent controls",
                "RESET_TEAM: Sends team back one level",
                "FIREWALL_SHIELD: Blocks incoming attacks"
            ],
            duration: 8000,
            className: "text-red-400"
        },
        {
            title: "STRATEGIC GAMEPLAY",
            content: "Balance between completing objectives and disrupting opponents. Time your attacks carefully and defend your team from enemy strikes.",
            duration: 5000,
            className: "text-purple-400"
        },
        {
            title: "VICTORY CONDITIONS",
            content: "Be the first team to conquer the final BOSS level and complete all 5 missions. Your success will be secured and transmitted.",
            duration: 4000,
            className: "text-amber-400"
        },
        {
            title: "MISSION START",
            content: "Your training is complete. Prepare for deployment. The fate of your team depends on your performance.",
            duration: 3000,
            className: "text-cyan-300"
        }
    ];

    useEffect(() => {
        if (!isPlaying) return;

        const timer = setTimeout(() => {
            if (currentScene < scenes.length - 1) {
                setCurrentScene(currentScene + 1);
            } else {
                // End prelude and start game
                const sessionRef = ref(db, `game_sessions/${sessionId}`);
                update(sessionRef, {
                    currentView: 'playing'
                });
            }
        }, scenes[currentScene].duration);

        return () => clearTimeout(timer);
    }, [currentScene, isPlaying, scenes, sessionId]);

    const handleSkip = () => {
        setIsPlaying(false);
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        update(sessionRef, {
            currentView: 'playing'
        });
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const currentSceneData = scenes[currentScene];

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl text-center">
                {/* Skip button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleSkip}
                        className="font-orbitron bg-slate-700/80 hover:bg-slate-600 text-cyan-300 px-4 py-2 rounded-md text-sm transition-all duration-300"
                    >
                        SKIP PRELUDE →
                    </button>
                </div>

                {/* Play/Pause button */}
                <div className="absolute top-4 left-4">
                    <button
                        onClick={handlePlayPause}
                        className="font-orbitron bg-slate-700/80 hover:bg-slate-600 text-cyan-300 px-4 py-2 rounded-md text-sm transition-all duration-300"
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                </div>

                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                        {[...Array(20)].map((_, i) => (
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

                {/* Scene content */}
                <div className="relative z-10">
                    <h1 className={`font-orbitron text-3xl md:text-5xl font-bold mb-8 ${currentSceneData.className} animate-fade-in`}>
                        {currentSceneData.title}
                    </h1>

                    <div className="bg-slate-800/60 border border-cyan-400/30 rounded-lg p-6 md:p-8 mb-8 backdrop-blur-sm animate-slide-up">
                        {Array.isArray(currentSceneData.content) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                {currentSceneData.content.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-slate-300">
                                        <span className="text-cyan-400">⚡</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                                {currentSceneData.content}
                            </p>
                        )}
                    </div>

                    {/* Progress indicator */}
                    <div className="flex justify-center space-x-2">
                        {scenes.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentScene ? 'bg-cyan-400 scale-125' : 'bg-slate-600'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Scene number */}
                    <div className="mt-4 text-slate-500">
                        Scene {currentScene + 1} of {scenes.length}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 1s ease-out;
                }
            `}</style>
        </div>
    );
};

export default GamePrelude;