import React from 'react';
import { ref, update, get } from 'firebase/database';
import { db } from '../../firebase';
import { POWERUPS, POWERUP_IDS } from '../../powerups';

const GlobalPowerupControls: React.FC = () => {

    const handleSpawnPowerupForAll = async (powerupId: string) => {
        if (!window.confirm(`Are you sure you want to deploy the "${POWERUPS[powerupId].name}" powerup to ALL active teams?`)) {
            return;
        }

        const sessionsRef = ref(db, 'game_sessions');
        const snapshot = await get(sessionsRef);
        const data = snapshot.val();
        
        if (data) {
            const updates: { [key: string]: any } = {};
            const activeSessionIds = Object.keys(data).filter(id => !data[id].completedAt);

            activeSessionIds.forEach(sessionId => {
                const session = data[sessionId];
                
                // Manually reconstruct the slots array to be dense
                const slots = Array(3).fill(null);
                if (session.powerups && session.powerups.slots) {
                    for (const key in session.powerups.slots) {
                        if (parseInt(key) < 3) {
                            slots[parseInt(key)] = session.powerups.slots[key];
                        }
                    }
                } else if (session.powerups) {
                    // if powerups object exists but slots don't, initialize
                    session.powerups.slots = slots;
                } else {
                    // if powerups object doesn't exist, initialize both
                    session.powerups = { slots: slots };
                }

                if (slots.includes(null)) {
                    const playerIds = Object.keys(session.players);
                    const randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];

                    const newBubble = {
                        visibleTo: randomPlayerId,
                        id: `bubble_${Date.now()}_${sessionId}`,
                        powerupId: powerupId,
                        position: { 
                            top: `${Math.floor(Math.random() * 70) + 15}%`, 
                            left: `${Math.floor(Math.random() * 70) + 15}%` 
                        },
                    };
                    updates[`/game_sessions/${sessionId}/powerupBubble`] = newBubble;
                }
            });

            if (Object.keys(updates).length > 0) {
                update(ref(db), updates);
                alert("Powerups deployed!");
            } else {
                alert("No teams had available inventory space to receive a powerup.");
            }
        }
    };

    return (
        <div className="bg-slate-900/70 border border-amber-400/30 rounded-lg p-4 md:p-6 mb-6 shadow-lg shadow-amber-500/10 backdrop-blur-sm">
            <h2 className="font-orbitron text-xl md:text-2xl font-semibold mb-4 text-amber-300">GLOBAL POWERUP DEPLOYMENT</h2>
            <p className="text-sm text-slate-400 mb-4">Deploy a powerup to every active team simultaneously.</p>
            <div className="flex flex-wrap gap-2">
                {POWERUP_IDS.map(powerupId => (
                    <button
                        key={powerupId}
                        onClick={() => handleSpawnPowerupForAll(powerupId)}
                        title={`Deploy ${POWERUPS[powerupId].name} to all`}
                        className="flex items-center gap-2 bg-slate-700 p-2 rounded text-lg transition-colors hover:bg-amber-700"
                    >
                        <span>{POWERUPS[powerupId].icon}</span>
                        <span className="text-sm text-white hidden sm:inline">{POWERUPS[powerupId].name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GlobalPowerupControls;
