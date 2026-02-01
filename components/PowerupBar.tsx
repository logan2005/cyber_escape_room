import React from 'react';
import { POWERUPS, Powerup } from '../powerups';

interface PowerupBarProps {
    powerupsState: {
        slots: (string | null)[];
    } | null;
    onActivate: (powerupId: string, slotIndex: number) => void;
}

const PowerupSlot: React.FC<{ powerupId: string | null, onActivate: () => void }> = ({ powerupId, onActivate }) => {
    const powerup: Powerup | null = powerupId ? POWERUPS[powerupId] : null;

    if (!powerup) {
        return (
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-800/50 border-2 border-dashed border-cyan-400/30 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400/30 text-3xl font-thin">?</span>
            </div>
        );
    }

    return (
        <button
            onClick={onActivate}
            className="w-20 h-20 md:w-24 md:h-24 bg-slate-900/70 border-2 border-cyan-400/50 rounded-lg flex flex-col items-center justify-center text-white p-1 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all duration-300 group"
            title={`${powerup.name}: ${powerup.description}`}
        >
            <span className="text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110">{powerup.icon}</span>
            <span className="font-orbitron text-xs truncate w-full px-1">{powerup.name}</span>
        </button>
    );
};

const PowerupBar: React.FC<PowerupBarProps> = ({ powerupsState, onActivate }) => {
    const slots = powerupsState?.slots || [null, null, null];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center justify-center gap-2 md:gap-4 bg-slate-900/70 border border-cyan-400/30 rounded-lg p-2 md:p-3 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                {slots.map((powerupId, index) => (
                    <PowerupSlot 
                        key={index} 
                        powerupId={powerupId}
                        onActivate={() => powerupId && onActivate(powerupId, index)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default PowerupBar;
