import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, update } from 'firebase/database';
import GlassPanel from './ui/GlassPanel';
import NeonButton from './ui/NeonButton';

interface GamePreludeProps {
    sessionId: string;
}

const GamePrelude: React.FC<GamePreludeProps> = ({ sessionId }) => {
    const [currentScene, setCurrentScene] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const scenes = [
        {
            title: "🚀 WELCOME TO CYBER TREASURE HUNT",
            content: "You are about to enter a high-stakes cyber operation where teams compete to complete missions and unlock digital treasures.",
            duration: 4000,
            color: 'cyan'
        },
        {
            title: "👥 TEAM FORMATION",
            content: "You have been assembled into an elite squad. Work together with your team members to outmaneuver rival teams and achieve mission objectives.",
            duration: 4000,
            color: 'blue'
        },
        {
            title: "🎯 MISSION OBJECTIVES",
            content: "Complete 4 challenging levels to face the final BOSS. Conquer all 5 levels to achieve victory. Your team must work together to solve each cyber puzzle.",
            duration: 5000,
            color: 'green'
        },
        {
            title: "⚡ POWERUP ARSENAL",
            content: "Collect and deploy powerful cyber abilities to gain tactical advantages. Use them wisely to dominate the battlefield.",
            duration: 4000,
            color: 'yellow'
        },
        {
            title: "🔥 ATTACK SYSTEMS",
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
            color: 'red'
        },
        {
            title: "🧠 STRATEGIC GAMEPLAY",
            content: "Balance between completing objectives and disrupting opponents. Time your attacks carefully and defend your team from enemy strikes.",
            duration: 5000,
            color: 'purple'
        },
        {
            title: "🏆 VICTORY CONDITIONS",
            content: "Be the first team to conquer the final BOSS level and complete all 5 missions. Your success will be secured and transmitted.",
            duration: 4000,
            color: 'amber'
        },
        {
            title: "🚀 MISSION START",
            content: "Your training is complete. Prepare for deployment. The fate of your team depends on your performance.",
            duration: 3000,
            color: 'cyan'
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                {/* Control buttons */}
                <div className="absolute top-4 right-4 z-20 flex space-x-2">
                    <NeonButton
                        onClick={handlePlayPause}
                        color="cyan"
                        size="sm"
                        glow
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </NeonButton>
                    <NeonButton
                        onClick={handleSkip}
                        color="pink"
                        size="sm"
                        glow
                    >
                        SKIP →
                    </NeonButton>
                </div>

                {/* Main prelude panel */}
                <GlassPanel
                    glowing
                    neonColor={currentSceneData.color as any}
                    title={currentSceneData.title}
                    icon="⚡"
                    floating
                    className="w-full"
                >
                    <div className="space-y-8">
                        {/* Scene content */}
                        <div className="text-center">
                            {Array.isArray(currentSceneData.content) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    {currentSceneData.content.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/40 border border-slate-600/50">
                                            <span className="text-2xl">⚡</span>
                                            <span className="text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                                    {currentSceneData.content}
                                </p>
                            )}
                        </div>

                        {/* Scene indicator */}
                        <div className="flex justify-center space-x-2">
                            {scenes.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentScene 
                                            ? 'bg-cyan-400 scale-125 animate-pulse' 
                                            : 'bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="text-center text-slate-500">
                            Scene {currentScene + 1} of {scenes.length}
                        </div>
                    </div>
                </GlassPanel>

                {/* Animated side panels */}
                <div className="absolute top-1/4 left-4 -translate-y-1/2 opacity-30">
                    <div className="w-4 h-32 bg-gradient-to-b from-cyan-400 to-transparent rounded-full animate-pulse" />
                </div>
                <div className="absolute top-1/4 right-4 -translate-y-1/2 opacity-30">
                    <div className="w-4 h-32 bg-gradient-to-b from-purple-400 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>
        </div>
    );
};

export default GamePrelude;