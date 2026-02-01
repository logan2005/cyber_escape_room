import React from 'react';
import { db } from '../firebase';
import { ref, onValue, update, runTransaction } from 'firebase/database';
import { LEVELS } from '../levels';
import { FAIL_MEME_VIDEOS, SUCCESS_MEME_VIDEOS } from '../constants';
import { POWERUPS } from '../powerups';
import { useGameEngines } from '../hooks/useGameEngines';
import TeamStatsHUD from './TeamStatsHUD';
import SecretPayload from './SecretPayload';
import SuccessScreen from './SuccessScreen';
import FailureScreen from './FailureScreen';
import PowerupBubble from './PowerupBubble';
import PowerupBar from './PowerupBar';
import TeamTargetModal from './TeamTargetModal';
import AttackInProgress from './AttackInProgress';
import AttackNotification from './AttackNotification';
import AttackPrevented from './AttackPrevented';
import AttackDeploymentSuccess from './AttackDeploymentSuccess';
import AttackReceived3D from './AttackReceived3D';

interface GameProps {
    uid: string;
    sessionId: string;
}

const AudioPlayer: React.FC<{ src: string }> = ({ src }) => (
    <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4">
        <h2 className="font-orbitron text-lg text-cyan-400 mb-2">AUDITORY CLUE // LISTEN CAREFULLY</h2>
        <audio controls loop src={src} className="w-full" />
    </div>
);

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => (
    <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4">
        <h2 className="font-orbitron text-lg text-cyan-400 mb-2">VIDEO EVIDENCE // ANALYZE CAREFULLY</h2>
        <video controls src={src} className="w-full rounded" />
    </div>
);

const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
    const [gameState, setGameState] = React.useState<any>(null);
    const [allSessions, setAllSessions] = React.useState<any>({});
    const [answer, setAnswer] = React.useState('');
    const [isFrozen, setIsFrozen] = React.useState(false);
    const [isTargeting, setIsTargeting] = React.useState<{ powerupId: string; slotIndex: number; attackerId?: string; } | null>(null);
    const [countdown, setCountdown] = React.useState<number | null>(null);
    const [revealedClueText, setRevealedClueText] = React.useState<string | null>(null);
    const [attackNotification, setAttackNotification] = React.useState<{ type: string; timestamp: number; attackerId?: string; target?: string; } | null>(null);
    const [attackPrevented, setAttackPrevented] = React.useState<{ type: string; attackerName?: string; message?: string; } | null>(null);
    const [attackDeploymentSuccess, setAttackDeploymentSuccess] = React.useState<{ type: string; targetTeamName: string; message?: string; } | null>(null);
    const [attackReceived3D, setAttackReceived3D] = React.useState<{ type: string; attackerTeamName: string; } | null>(null);
    const [clearVisualEffects, setClearVisualEffects] = React.useState(false);

    React.useEffect(() => {
        const sessionRef = ref(db, `game_sessions/${sessionId}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => setGameState(snapshot.val()));

        const allSessionsRef = ref(db, 'game_sessions');
        const unsubscribeAll = onValue(allSessionsRef, (snapshot) => setAllSessions(snapshot.val()));
        
        return () => {
            unsubscribe();
            unsubscribeAll();
        };
    }, [sessionId]);

    // Game end detection - check if any team has completed all levels (level 5 boss)
    React.useEffect(() => {
        if (!allSessions || Object.keys(allSessions).length === 0) return;

        const completedSessions = Object.entries(allSessions)
            .filter(([, session]: [string, any]) => session && session.completedAt)
            .sort(([, a], [, b]) => (a as any).completedAt - (b as any).completedAt);

        if (completedSessions.length > 0) {
            // Game should end - show end screen for all players
            completedSessions.forEach(([sessionId]) => {
                update(ref(db, `game_sessions/${sessionId}`), {
                    currentView: 'game_end'
                });
            });
        }
    }, [allSessions]);

    const { level, players, currentTypist, currentView, activeMemeUrl, activeAttack } = gameState || {};
    
    const { amITypist, myPlayerIndex, sortedPlayerIds } = React.useMemo<{ amITypist: boolean; myPlayerIndex: number; sortedPlayerIds: string[] }>(() => {
        if (!players || !uid) return { amITypist: false, myPlayerIndex: -1, sortedPlayerIds: [] };
        const sortedIds = Object.keys(players).sort();
        const myIndex = sortedIds.indexOf(uid);
        const isTypist = currentTypist === uid;
        return { amITypist: isTypist, myPlayerIndex: myIndex, sortedPlayerIds: sortedIds };
    }, [players, uid, currentTypist]);

    const { powerupBubble, secretPayload, powerups } = useGameEngines({ sessionId, amITypist, sortedPlayerIds, level });

    React.useEffect(() => {
        if (level === 5 && gameState?.level5ClueTriggeredAt && LEVELS[4]?.timedClue) {
            const timedClue = LEVELS[4].timedClue;
            const revealTime = gameState.level5ClueTriggeredAt + (timedClue.delay * 1000);
            const interval = setInterval(() => {
                const timeRemaining = revealTime - Date.now();
                if (timeRemaining <= 0) {
                    setCountdown(0);
                    setRevealedClueText(timedClue.text);
                    clearInterval(interval);
                } else {
                    setCountdown(Math.ceil(timeRemaining / 1000));
                }
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCountdown(null);
            setRevealedClueText(null);
        }
    }, [level, gameState?.level5ClueTriggeredAt]);

    React.useEffect(() => {
        if (!activeAttack || !activeAttack.timestamp) {
            return;
        }

        // Show attack notification if this user is the target
        if (activeAttack.target === uid) {
            setAttackNotification(activeAttack);
            
            // Show 3D attack received animation - simplified approach
            if (activeAttack.attackerId) {
                // Find the attacker's session by checking all sessions for the attackerId
                let attackerTeamName = 'Unknown Team';
                for (const [, sessionData] of Object.entries(allSessions)) {
                    const session = sessionData as any;
                    if (session.players && session.players[activeAttack.attackerId]) {
                        attackerTeamName = Object.values(session.players).map((p: any) => p.name).join(', ');
                        break;
                    }
                }
                
                setAttackReceived3D({
                    type: activeAttack.type,
                    attackerTeamName
                });
                setTimeout(() => setAttackReceived3D(null), 3000);
            }
            
            setTimeout(() => setAttackNotification(null), 3000);
        }

        // Only TIME_DRAIN and DISCONNECT should cause freezing
        const shouldFreeze = activeAttack.type === 'TIME_DRAIN' || activeAttack.type === 'DISCONNECT';
        
        // Check if this is a double agent backfire (shorter duration)
        const isDoubleAgentBackfire = activeAttack.isDoubleAgentBackfire;
        const effectDuration = isDoubleAgentBackfire ? 15000 : 30000; // 15s for backfire, 30s for normal
        
        if (shouldFreeze) {
            const freezeEndTime = activeAttack.timestamp + effectDuration;
            if (Date.now() < freezeEndTime) {
                setIsFrozen(true);
                setClearVisualEffects(false);
                const timeout = setTimeout(() => {
                    setIsFrozen(false);
                    setClearVisualEffects(true); // Signal to clear all visual effects
                    setTimeout(() => setClearVisualEffects(false), 100); // Reset the signal
                    if (amITypist) { // Only typist clears activeAttack
                        update(ref(db, `game_sessions/${sessionId}`), { activeAttack: null });
                    }
                }, freezeEndTime - Date.now());
                return () => clearTimeout(timeout);
            }
            setIsFrozen(false);
        }
        
        // For non-freezing attacks, we still need to clear them after duration
        if (!shouldFreeze) {
            const clearTime = activeAttack.timestamp + effectDuration;
            if (Date.now() < clearTime) {
                const timeout = setTimeout(() => {
                    setClearVisualEffects(true); // Signal to clear all visual effects
                    setTimeout(() => setClearVisualEffects(false), 100); // Reset the signal
                    if (amITypist) { // Only typist clears activeAttack
                        update(ref(db, `game_sessions/${sessionId}`), { activeAttack: null });
                    }
                }, clearTime - Date.now());
                return () => clearTimeout(timeout);
            }
        }
    }, [activeAttack, amITypist, sessionId, uid]);

    const currentLevelData = level > 0 && level <= LEVELS.length ? LEVELS[level - 1] : null;

    const handleClaimBubble = () => {
        runTransaction(ref(db, `game_sessions/${sessionId}`), (session) => {
            if (session && session.powerupBubble && session.powerupBubble.powerupId) {
                
                // Ensure powerups object exists
                if (!session.powerups) {
                    session.powerups = {}; 
                }

                // Manually reconstruct the slots array to be dense (actual limit is 3)
                const currentSlots = Array(3).fill(null); // Actual limit of 3
                if (session.powerups.slots) {
                    for (const key in session.powerups.slots) {
                        if (parseInt(key) < 3) { // Actual limit of 3
                            currentSlots[parseInt(key)] = session.powerups.slots[key];
                        }
                    }
                }
                session.powerups.slots = currentSlots; // Assign the dense array back

                const freeSlotIndex = session.powerups.slots.indexOf(null);

                if (freeSlotIndex !== -1) {
                    session.powerups.slots[freeSlotIndex] = session.powerupBubble.powerupId;
                    session.powerupBubble = null;
                }
            }
            return session;
        });
    };

    const handleSubmitAnswer = () => {
        if (!currentLevelData || isFrozen) return;
        const updates: { [key: string]: any } = {};
        if (answer.trim().toLowerCase() === currentLevelData.answer.toLowerCase()) {
            updates.currentView = 'success';
            updates.activeMemeUrl = SUCCESS_MEME_VIDEOS[Math.floor(Math.random() * SUCCESS_MEME_VIDEOS.length)];
        } else {
            updates.currentView = 'failure';
            updates.activeMemeUrl = FAIL_MEME_VIDEOS[Math.floor(Math.random() * FAIL_MEME_VIDEOS.length)];
        }
        update(ref(db, `game_sessions/${sessionId}`), updates);
    };
    
    const handleTryAgain = () => {
        update(ref(db, `game_sessions/${sessionId}`), { currentView: 'playing', activeMemeUrl: null });
        setAnswer('');
    };

    const advanceLevel = () => {
        const nextLevel = level + 1;
        const nextTypistId = sortedPlayerIds.length > 0 ? sortedPlayerIds[nextLevel % sortedPlayerIds.length] : null;
        
        const updates: { [key: string]: any } = {
            level: nextLevel,
            score: (gameState.score || 0) + 100,
            lastLevelCompletedAt: Date.now(),
            currentTypist: nextTypistId,
            level5ClueTriggeredAt: null,
            secretPayloadState: { visibleTo: nextTypistId, position: { top: '50%', left: '50%' } },
            powerupBubble: null,
            currentView: 'playing',
            activeMemeUrl: null,
            activeAttack: null,
        };
        if (nextLevel > LEVELS.length) {
            updates.completedAt = Date.now();
            updates.currentTypist = null;
        }
        update(ref(db, `game_sessions/${sessionId}`), updates);
        setAnswer('');
    };

    const handleTriggerTimedClue = () => {
        if (level === 5 && currentLevelData?.timedClue && !gameState?.level5ClueTriggeredAt) {
            update(ref(db, `game_sessions/${sessionId}`), { level5ClueTriggeredAt: Date.now() });
        }
    };

    const handleActivatePowerup = (powerupId: string, slotIndex: number) => {
        const powerup = POWERUPS[powerupId];
        if (!powerup) return;

        runTransaction(ref(db, `game_sessions/${sessionId}`), (session) => {
            if (session) {
                // Consume the powerup from the slot
                if (session.powerups?.slots) {
                    session.powerups.slots[slotIndex] = null;
                } else {
                    // Initialize if powerups or slots don't exist
                    session.powerups = { slots: Array(3).fill(null), activeDefense: null };
                }

                if (powerup.type === 'ATTACK' || powerup.type === 'CHAOS') {
                    // This part sets local state, not DB state, so it remains outside the transaction return
                    // We just need to ensure the slot is cleared in DB.
                } else if (powerup.type === 'DEFENSE') {
                    session.powerups.activeDefense = powerupId;
                }
            }
            return session;
        }).then(() => {
            // After transaction, if it's an ATTACK or CHAOS powerup, proceed to targeting (local state)
            if (powerup.type === 'ATTACK' || powerup.type === 'CHAOS') {
                setIsTargeting({ powerupId, slotIndex, attackerId: uid });
            }
        });
    };

    const launchAttack = (targetSessionId: string) => {
        if (!isTargeting || !isTargeting.powerupId) return;
        const { powerupId } = isTargeting;
        
        const targetRef = ref(db, `game_sessions/${targetSessionId}`);
        runTransaction(targetRef, (session) => {
            if (session) {
                if (session.powerups?.activeDefense === 'FIREWALL_SHIELD') {
                    session.powerups.activeDefense = null;
                    // Show attack prevented notification
                    const attackerSession = allSessions[sessionId];
                    if (attackerSession && attackerSession.players && attackerSession.players[uid]) {
                        const attackerName = attackerSession.players[uid]?.name || 'Unknown';
                        setAttackPrevented({ type: powerupId, attackerName });
                        setTimeout(() => setAttackPrevented(null), 2000);
                    }
                } else {
                    if (powerupId === 'RESET_TEAM') {
                        const targetPlayers = Object.keys(session.players);
                        const newTypist = targetPlayers[Math.floor(Math.random() * targetPlayers.length)];
                        session.level = 1;
                        session.score = 0;
                        session.currentTypist = newTypist;
                        session.secretPayloadState = { visibleTo: newTypist, position: { top: '50%', left: '50%'} };
                        session.level5ClueTriggeredAt = null;
                    } else if (powerupId === 'DOUBLE_AGENT') {
                        // DOUBLE AGENT: 50/50 chance - attack or backfire
                        // Check if target has firewall shield
                        if (session.powerups?.activeDefense === 'FIREWALL_SHIELD') {
                            session.powerups.activeDefense = null;
                            // Show attack prevented notification
                            const attackerSession = allSessions[sessionId];
                            if (attackerSession && attackerSession.players && attackerSession.players[uid]) {
                                const attackerName = attackerSession.players[uid]?.name || 'Unknown';
                                setAttackPrevented({ 
                                    type: powerupId, 
                                    attackerName,
                                    message: 'DOUBLE AGENT BLOCKED\nFIREWALL SHIELD PROTECTED 🛡️'
                                });
                                setTimeout(() => setAttackPrevented(null), 2000);
                            }
                        } else {
                            const isAttackMode = Math.random() < 0.5; // 50% chance for attack mode
                            
                            if (isAttackMode) {
                                // ATTACK MODE: Select another random player and apply random attack
                                const availableAttacks = ['TIME_DRAIN', 'INPUT_DELAY', 'REALITY_FLIP'];
                                const randomAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
                                const targetPlayers = Object.keys(session.players);
                                const randomTargetUserId = targetPlayers[Math.floor(Math.random() * targetPlayers.length)];
                                
                                session.activeAttack = { 
                                    type: randomAttack, 
                                    timestamp: Date.now(), 
                                    attackerId: uid, 
                                    target: randomTargetUserId,
                                    isDoubleAgentSuccess: true // Mark as double agent success
                                };
                                
                                // Show double agent success animation
                                const targetTeamName = Object.values(session.players).map((p: any) => p.name).join(', ');
                                setAttackDeploymentSuccess({
                                    type: powerupId,
                                    targetTeamName,
                                    message: 'DOUBLE AGENT SUCCESS\nAVANUKKU SAMBAVAM 😈'
                                });
                                setTimeout(() => setAttackDeploymentSuccess(null), 3000);
                            } else {
                                // BACKFIRE MODE: Attack hits the user instead
                                const availableAttacks = ['TIME_DRAIN', 'INPUT_DELAY', 'REALITY_FLIP'];
                                const randomAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
                                
                                session.activeAttack = { 
                                    type: randomAttack, 
                                    timestamp: Date.now(), 
                                    attackerId: uid, 
                                    target: uid, // Target is the user themselves
                                    isDoubleAgentBackfire: true // Mark as double agent backfire
                                };
                                
                                // Show double agent backfire animation
                                setAttackDeploymentSuccess({
                                    type: powerupId,
                                    targetTeamName: 'YOURSELF',
                                    message: 'DOUBLE AGENT BACKFIRED\nNAMAKKAE SAMBAVAM 🤡'
                                });
                                setTimeout(() => setAttackDeploymentSuccess(null), 3000);
                            }
                        }
                    } else {
                        // All other attacks (TIME_DRAIN, INPUT_DELAY, SYSTEM_GLITCH, REALITY_FLIP)
                        // Target a random user in the target session
                        const targetPlayers = Object.keys(session.players);
                        const randomTargetUserId = targetPlayers[Math.floor(Math.random() * targetPlayers.length)];
                        session.activeAttack = { type: powerupId, timestamp: Date.now(), attackerId: uid, target: randomTargetUserId };
                    }
                    
                    // Show attack deployment success animation
                    const targetTeamName = Object.values(session.players).map((p: any) => p.name).join(', ');
                    setAttackDeploymentSuccess({
                        type: powerupId,
                        targetTeamName
                    });
                    setTimeout(() => setAttackDeploymentSuccess(null), 3000);
                }
            }
            return session;
        });
        setIsTargeting(null);
    };

    const renderPlayingView = () => {
        if (!gameState || !currentLevelData) { return <p className="text-center animate-pulse text-cyan-300">Establishing secure connection...</p>; }
        if (level > LEVELS.length) {
            const teamNames = Object.values(players).map((p: any) => p.name).join(', ');
            return (
                <div className="text-center">
                    <h1 className="font-orbitron text-3xl md:text-4xl text-cyan-300 mb-4">MISSION COMPLETE</h1>
                    <p className="text-lg text-slate-300">Team <span className="font-bold text-white">{teamNames}</span> has successfully infiltrated the system.</p>
                    <p className="text-2xl text-white mt-4">Final Score: <span className="font-bold text-cyan-300">{gameState.score}</span></p>
                </div>
            );
        }
        
        const isSolo = Object.keys(players).length === 1;
        const myClue = isSolo ? currentLevelData.clues.join(' \n\n ') : currentLevelData.clues[myPlayerIndex % currentLevelData.clues.length];
        const clueTitle = isSolo ? `DATA FRAGMENT // AGENT_${uid.substring(0,4)}` : `DATA FRAGMENT ${myPlayerIndex % currentLevelData.clues.length + 1} // AGENT_${uid.substring(0,4)}`;

        const inputDelayEffect = activeAttack?.type === 'INPUT_DELAY' && activeAttack.timestamp && Date.now() < activeAttack.timestamp + 30000;
        // const systemGlitchEffect = activeAttack?.type === 'SYSTEM_GLITCH' && activeAttack.timestamp && Date.now() < activeAttack.timestamp + 20000;
        // const doubleAgentEffect = activeAttack?.type === 'DOUBLE_AGENT' && activeAttack.timestamp && Date.now() < activeAttack.timestamp + 15000;
        // const realityFlipEffect = activeAttack?.type === 'REALITY_FLIP' && activeAttack.timestamp && Date.now() < activeAttack.timestamp + 10000;


        return (
            <>
                <h1 className="font-orbitron text-2xl md:text-3xl text-cyan-300 mb-2">SEQUENCE {level}</h1>
                <p className="text-lg text-slate-300 mb-6">{currentLevelData.question}</p>
                {currentLevelData.audioClue && ( <AudioPlayer src={currentLevelData.audioClue} /> )}
                {currentLevelData.videoClue && ( <VideoPlayer src={currentLevelData.videoClue} /> )}
                {level === 5 && currentLevelData.timedClue && !gameState?.level5ClueTriggeredAt && (
                    <div className="text-center my-6">
                        <button onClick={handleTriggerTimedClue} className="font-orbitron bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-md text-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50">
                            INITIATE CLUE DECRYPTION
                        </button>
                    </div>
                )}
                {level === 5 && currentLevelData.timedClue && gameState?.level5ClueTriggeredAt && (
                    <div className="bg-slate-900 border border-amber-400/30 p-4 rounded-lg my-4 text-center">
                        <h2 className="font-orbitron text-lg text-amber-400 mb-2">TIME-LOCKED CLUE // STATUS: {revealedClueText ? 'DECRYPTED' : 'PENDING'}</h2>
                        {revealedClueText ? ( <p className="text-2xl font-mono text-amber-200 animate-pulse">{revealedClueText}</p> ) : ( <p className="text-2xl font-mono text-amber-200 animate-pulse">REVEALING IN... {countdown}s</p> )}
                    </div>
                )}
                <div className="bg-slate-900 border border-cyan-400/30 p-4 rounded-lg my-4">
                    <h2 className="font-orbitron text-lg text-cyan-400 mb-2">{clueTitle}</h2>
                    <p className="text-2xl font-mono text-white animate-pulse whitespace-pre-wrap">{myClue}</p>
                </div>
                <div className="my-6">
                    <p className="text-slate-300">Designated typist: <span className="font-bold text-white">{players[currentTypist]?.name || '...'}</span></p>
                </div>
                {amITypist && (
                    <div className="mt-6">
                        <input
                            disabled={isFrozen || inputDelayEffect} // Apply input delay here
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                            placeholder="INPUT DECRYPTION KEY"
                            className={`font-orbitron p-3 bg-slate-800 border border-slate-700 rounded-md w-full max-w-sm mb-2 text-center text-lg text-cyan-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none focus:border-cyan-400 disabled:opacity-50
                                ${inputDelayEffect ? 'input-delay-effect' : ''}
                            `}
                        />
                        <button disabled={isFrozen} onClick={handleSubmitAnswer} className="font-orbitron bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-md w-full max-w-sm text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                            EXECUTE
                        </button>
                    </div>
                )}
            </>
        );
    };
    
    const opponentTeams = Object.keys(allSessions || {})
        .filter(id => id !== sessionId && !allSessions[id].completedAt)
        .map(id => ({ sessionId: id, teamName: Object.values(allSessions[id].players).map((p: any) => p.name).join(', ') }));

    if (currentView === 'success') {
        return <SuccessScreen memeUrl={activeMemeUrl} onProceed={advanceLevel} />;
    }
    if (currentView === 'failure') {
        return <FailureScreen memeUrl={activeMemeUrl} onTryAgain={handleTryAgain} />;
    }

    return (
        <div className={`
            ${!clearVisualEffects && activeAttack?.type === 'SYSTEM_GLITCH' && activeAttack.timestamp && Date.now() < activeAttack.timestamp + 20000 ? 'system-glitch-effect' : ''}
            ${!clearVisualEffects && activeAttack?.type === 'REALITY_FLIP' && activeAttack.timestamp && Date.now() < activeAttack.timestamp + 10000 ? 'reality-flip-effect' : ''}
        `}> 
            {attackDeploymentSuccess && (
                <AttackDeploymentSuccess 
                    attackType={attackDeploymentSuccess.type}
                    targetTeamName={attackDeploymentSuccess.targetTeamName}
                    onDismiss={() => setAttackDeploymentSuccess(null)}
                />
            )}
            {attackReceived3D && (
                <AttackReceived3D 
                    attackType={attackReceived3D.type}
                    attackerTeamName={attackReceived3D.attackerTeamName}
                    onDismiss={() => setAttackReceived3D(null)}
                />
            )}
            {attackNotification && (
                <AttackNotification 
                    activeAttack={attackNotification}
                    attackerName={attackNotification.attackerId ? allSessions[attackNotification.attackerId]?.players?.[attackNotification.attackerId]?.name || 'Unknown' : 'Unknown'}
                    onDismiss={() => setAttackNotification(null)}
                />
            )}
            {attackPrevented && (
                <AttackPrevented 
                    attackType={attackPrevented.type}
                    attackerName={attackPrevented.attackerName}
                    onDismiss={() => setAttackPrevented(null)}
                />
            )}
            {activeAttack && activeAttack.attackerId === uid && !clearVisualEffects && (
                <AttackInProgress 
                    activeAttack={activeAttack}
                    attackerName={players?.[uid]?.name || 'You'}
                    targetName={activeAttack.target && allSessions[activeAttack.target as string]?.players ? Object.values(allSessions[activeAttack.target as string].players).map((p: any) => p.name).join(', ') : 'Unknown'}
                />
            )}
            {isTargeting && <TeamTargetModal opponents={opponentTeams} onSelectTarget={launchAttack} onCancel={() => setIsTargeting(null)} />}
            {isFrozen && <div className="fixed inset-0 z-50 bg-blue-900/50 flex items-center justify-center backdrop-blur-sm"><h1 className="font-orbitron text-4xl text-blue-200 animate-pulse">SYSTEM FROZEN</h1></div>}
            {gameState && <TeamStatsHUD gameState={gameState} />}
            {secretPayload && secretPayload.visibleTo === uid && currentLevelData?.secretEncodings &&
                <SecretPayload 
                    text={currentLevelData.secretEncodings[myPlayerIndex % currentLevelData.secretEncodings.length]} 
                    position={secretPayload.position} 
                />
            }
            {powerupBubble && powerupBubble.visibleTo === uid && (
                <PowerupBubble 
                    onClick={handleClaimBubble} 
                    position={powerupBubble.position} 
                />
            )}
            <div className="pb-32 bg-slate-900/70 border border-cyan-400/30 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                {renderPlayingView()}
            </div>
            <PowerupBar powerupsState={powerups} onActivate={handleActivatePowerup} />
             <style>{`
                .system-glitch-effect {
                    filter: invert(100%) hue-rotate(180deg) brightness(120%) saturate(150%);
                    animation: glitch-flicker 0.1s infinite;
                }
                .reality-flip-effect {
                    transform: rotateX(180deg) rotateY(180deg);
                    transition: transform 0.5s ease-in-out;
                }
                @keyframes glitch-flicker {
                    0% { opacity: 1; }
                    50% { opacity: 0.8; }
                    100% { opacity: 1; }
                }
                .animate-pulse-fast {
                    animation: pulse-fast 0.5s infinite;
                }
                @keyframes pulse-fast {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                .animate-attack-in {
                    animation: attack-in 0.3s ease-out;
                }
                @keyframes attack-in {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-shake {
                    animation: shake 0.5s infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-flash {
                    animation: flash 0.3s infinite;
                }
                @keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                .animate-wiggle {
                    animation: wiggle 0.5s infinite;
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(1deg); }
                    75% { transform: rotate(-1deg); }
                }
                .animate-glitch {
                    animation: glitch 0.3s infinite;
                }
                @keyframes glitch {
                    0%, 100% { filter: hue-rotate(0deg); }
                    50% { filter: hue-rotate(90deg); }
                }
                .animate-fade {
                    animation: fade 0.5s infinite;
                }
                @keyframes fade {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-flip {
                    animation: flip 0.6s infinite;
                }
                @keyframes flip {
                    0%, 100% { transform: rotateY(0deg); }
                    50% { transform: rotateY(180deg); }
                }
                /* Input field animations */
                .input-delay-effect {
                    animation: input-delay-wiggle 0.2s infinite;
                }
                @keyframes input-delay-wiggle {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
                /* System glitch enhanced effect */
                .system-glitch-effect {
                    filter: invert(100%) hue-rotate(180deg) brightness(120%) saturate(150%);
                    animation: glitch-flicker 0.1s infinite;
                }
                @keyframes glitch-flicker {
                    0% { opacity: 1; }
                    50% { opacity: 0.8; }
                    100% { opacity: 1; }
                }
                /* Reality flip effect */
                .reality-flip-effect {
                    transform: rotateX(180deg) rotateY(180deg);
                    transition: transform 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Game;