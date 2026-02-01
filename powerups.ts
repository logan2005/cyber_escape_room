export interface Powerup {
    id: string;
    name: string;
    description: string;
    type: 'ATTACK' | 'DEFENSE' | 'CHAOS';
    icon: string; // Emoji icon for now
}

export const POWERUPS: { [key: string]: Powerup } = {
    TIME_DRAIN: { 
        id: 'TIME_DRAIN', 
        name: 'Time Drain', 
        description: 'Freezes the target team\'s input for 30 seconds.', 
        type: 'ATTACK', 
        icon: '⏱️' 
    },
    INPUT_DELAY: { 
        id: 'INPUT_DELAY', 
        name: 'Input Delay', 
        description: 'Adds a small typing delay for the target team\'s typist.', 
        type: 'ATTACK', 
        icon: '⌨️' 
    },
    RESET_TEAM: { 
        id: 'RESET_TEAM', 
        name: 'Reset Team', 
        description: 'Forces the entire target team to restart from Level 1, resetting their score.', 
        type: 'ATTACK', 
        icon: '🧨' 
    },
    FIREWALL_SHIELD: { 
        id: 'FIREWALL_SHIELD', 
        name: 'Firewall Shield', 
        description: 'Blocks one incoming attack power-up.', 
        type: 'DEFENSE', 
        icon: '🧱' 
    },
    DISCONNECT: {
        id: 'DISCONNECT',
        name: 'Disconnect',
        description: 'Temporarily disables a random teammate for 30 seconds.',
        type: 'CHAOS',
        icon: '🔌'
    },
    SYSTEM_GLITCH: { 
        id: 'SYSTEM_GLITCH', 
        name: 'System Glitch', 
        description: 'Triggers a random effect: either helps you or mildly disrupts another team.', 
        type: 'CHAOS', 
        icon: '🎲' 
    },
    DOUBLE_AGENT: { 
        id: 'DOUBLE_AGENT', 
        name: 'Double Agent', 
        description: 'Has a 50/50 chance to launch an attack on another team or backfire on you.', 
        type: 'CHAOS', 
        icon: '🎭' 
    },
    REALITY_FLIP: { 
        id: 'REALITY_FLIP', 
        name: 'Reality Flip', 
        description: 'Temporarily distorts the target team\'s visuals.', 
        type: 'CHAOS', 
        icon: '🌀' 
    },
};

export const POWERUP_IDS = Object.keys(POWERUPS);
