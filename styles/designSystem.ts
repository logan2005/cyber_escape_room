// High-tech design system and utilities
export const TECH_COLORS = {
    // Primary cyber colors
    neonCyan: '#00ffff',
    neonPink: '#ff00ff',
    neonGreen: '#00ff00',
    neonYellow: '#ffff00',
    neonPurple: '#9d00ff',
    electricBlue: '#007fff',
    lavaOrange: '#ff4500',
    
    // Backgrounds and overlays
    darkBg: '#0a0a0f',
    darkerBg: '#050507',
    glassBg: 'rgba(255, 255, 255, 0.02)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    
    // Text colors
    brightText: '#ffffff',
    dimText: '#a0a0a0',
    accentText: '#00ffff'
};

export const ANIMATION_TIMING = {
    fast: 150,
    medium: 300,
    slow: 500,
    epic: 1000
};

export const GRADIENTS = {
    cyberRainbow: 'linear-gradient(135deg, #00ffff, #ff00ff, #ffff00, #00ff00)',
    neonGlow: 'linear-gradient(135deg, #00ffff, #007fff)',
    fireIce: 'linear-gradient(135deg, #ff4500, #00ffff)',
    electricStorm: 'linear-gradient(135deg, #9d00ff, #00ffff)',
    matrixRain: 'linear-gradient(135deg, #00ff00, #001100)'
};

// Animation utilities
export const animations = {
    float: {
        animation: 'float 6s ease-in-out infinite',
        keyframes: `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
        `
    },
    glow: {
        animation: 'glow 2s ease-in-out infinite alternate',
        keyframes: `
            @keyframes glow {
                from { filter: drop-shadow(0 0 5px currentColor); }
                to { filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 30px currentColor); }
            }
        `
    },
    pulse: {
        animation: 'pulse 1.5s ease-in-out infinite',
        keyframes: `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.05); }
            }
        `
    },
    hologram: {
        animation: 'hologram 3s ease-in-out infinite',
        keyframes: `
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
        `
    },
    glitch: {
        animation: 'glitch 0.3s ease-in-out infinite',
        keyframes: `
            @keyframes glitch {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
            }
        `
    },
    cyberRotate: {
        animation: 'cyberRotate 20s linear infinite',
        keyframes: `
            @keyframes cyberRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `
    }
};

// Component style generators
export const createGlowButton = (color: string = TECH_COLORS.neonCyan) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}44)`,
    border: `1px solid ${color}88`,
    color: color,
    boxShadow: `0 0 20px ${color}66, inset 0 0 20px ${color}22`,
    transition: 'all 0.3s ease',
    '&:hover': {
        background: `linear-gradient(135deg, ${color}44, ${color}66)`,
        boxShadow: `0 0 30px ${color}aa, inset 0 0 30px ${color}33`,
        transform: 'translateY(-2px)',
    }
});

export const createGlassPanel = () => ({
    background: TECH_COLORS.glassBg,
    border: `1px solid ${TECH_COLORS.glassBorder}`,
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
});

export const createNeonText = (color: string = TECH_COLORS.neonCyan) => ({
    color: color,
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
    fontWeight: 'bold'
});