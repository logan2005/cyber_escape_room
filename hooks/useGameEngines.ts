import React from 'react';
import { ref, runTransaction, onValue } from 'firebase/database';
import { db } from '../firebase';
import { LEVELS } from '../levels';

interface GameEnginesProps {
    sessionId: string;
    amITypist: boolean;
    sortedPlayerIds: string[];
    level: number;
}

export const useGameEngines = ({ sessionId, amITypist, sortedPlayerIds, level }: GameEnginesProps) => {
    const [powerupBubble, setPowerupBubble] = React.useState<any>(null);
    const [secretPayload, setSecretPayload] = React.useState<any>(null);
    const [powerups, setPowerups] = React.useState<any>(null);

    React.useEffect(() => {
        const bubbleRef = ref(db, `game_sessions/${sessionId}/powerupBubble`);
        const payloadRef = ref(db, `game_sessions/${sessionId}/secretPayloadState`);
        const powerupsRef = ref(db, `game_sessions/${sessionId}/powerups`);

        const unsubBubble = onValue(bubbleRef, (snapshot) => setPowerupBubble(snapshot.val()));
        const unsubPayload = onValue(payloadRef, (snapshot) => setSecretPayload(snapshot.val()));
        
        const unsubPowerups = onValue(powerupsRef, (snapshot) => {
            const powerupsData = snapshot.val();
            if (powerupsData && powerupsData.slots) {
                const denseSlots = Array(3).fill(null);
                for (const key in powerupsData.slots) {
                    if(parseInt(key) < 3) denseSlots[parseInt(key)] = powerupsData.slots[key];
                }
                powerupsData.slots = denseSlots;
            } else if (powerupsData) {
                powerupsData.slots = Array(3).fill(null);
            }
            setPowerups(powerupsData);
        });

        return () => {
            unsubBubble();
            unsubPayload();
            unsubPowerups();
        };
    }, [sessionId]);

    // "Powerup Bubble" Spawning Engine
    React.useEffect(() => {
        if (amITypist && sortedPlayerIds.length > 0 && level > 0 && level <= LEVELS.length) {
            // Powerup bubble spawning is now admin-driven
            // const BUBBLE_SPAWN_INTERVAL = 20000;
            // const spawnLogic = () => {
            //     runTransaction(ref(db, `game_sessions/${sessionId}`), (session) => {
            //         if (session && !session.powerupBubble) {
            //             const slots = Array(3).fill(null);
            //             if (session.powerups && session.powerups.slots) {
            //                 for (const key in session.powerups.slots) {
            //                     if(parseInt(key) < 3) slots[parseInt(key)] = session.powerups.slots[key];
            //                 }
            //             }
            //             
            //             if (slots.includes(null)) {
            //                 const randomPlayerId = sortedPlayerIds[Math.floor(Math.random() * sortedPlayerIds.length)];
            //                 session.powerupBubble = {
            //                     visibleTo: randomPlayerId,
            //                     id: `bubble_${Date.now()}`,
            //                     powerupId: "placeholder", // This will be set by the admin spawner
            //                     position: { top: `${Math.floor(Math.random() * 70) + 15}%`, left: `${Math.floor(Math.random() * 70) + 15}%` },
            //                 };
            //             }
            //         }
            //         return session;
            //     });
            // };
            // This engine is now disabled in favor of admin-driven spawning.
            // const interval = setInterval(spawnLogic, BUBBLE_SPAWN_INTERVAL);
            // return () => clearInterval(interval);
        }
    }, [amITypist, sortedPlayerIds, sessionId, level]);

    // "Jumping Secret Payload" Engine
    React.useEffect(() => {
        if (amITypist && sortedPlayerIds.length > 0 && level > 0 && level <= LEVELS.length) {
            const JUMP_INTERVAL = 5000;
            const jumpLogic = () => {
                runTransaction(ref(db, `game_sessions/${sessionId}`), (session) => {
                    if (session && session.secretPayloadState) {
                        const currentHolderIndex = sortedPlayerIds.indexOf(session.secretPayloadState.visibleTo);
                        const nextHolderIndex = (currentHolderIndex + 1) % sortedPlayerIds.length;
                        session.secretPayloadState.visibleTo = sortedPlayerIds[nextHolderIndex];
                        session.secretPayloadState.position = {
                            top: `${Math.floor(Math.random() * 80) + 10}%`,
                            left: `${Math.floor(Math.random() * 80) + 10}%`,
                        };
                    }
                    return session;
                });
            };
            const interval = setInterval(jumpLogic, JUMP_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [amITypist, sortedPlayerIds, sessionId, level]);

    return { powerupBubble, secretPayload, powerups };
};
