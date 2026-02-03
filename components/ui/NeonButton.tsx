import React from 'react';

interface NeonButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    color?: 'cyan' | 'pink' | 'green' | 'yellow' | 'purple';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    glow?: boolean;
    pulse?: boolean;
    className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({
    onClick,
    children,
    color = 'cyan',
    size = 'md',
    disabled = false,
    glow = false,
    pulse = false,
    className = ''
}) => {
    const colorMap = {
        cyan: {
            bg: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 127, 255, 0.3))',
            border: 'rgba(0, 255, 255, 0.6)',
            shadow: 'rgba(0, 255, 255, 0.5)',
            text: '#00ffff',
            hover: 'rgba(0, 255, 255, 0.8)'
        },
        pink: {
            bg: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(255, 0, 127, 0.3))',
            border: 'rgba(255, 0, 255, 0.6)',
            shadow: 'rgba(255, 0, 255, 0.5)',
            text: '#ff00ff',
            hover: 'rgba(255, 0, 255, 0.8)'
        },
        green: {
            bg: 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 127, 0.3))',
            border: 'rgba(0, 255, 0, 0.6)',
            shadow: 'rgba(0, 255, 0, 0.5)',
            text: '#00ff00',
            hover: 'rgba(0, 255, 0, 0.8)'
        },
        yellow: {
            bg: 'linear-gradient(135deg, rgba(255, 255, 0, 0.2), rgba(255, 255, 127, 0.3))',
            border: 'rgba(255, 255, 0, 0.6)',
            shadow: 'rgba(255, 255, 0, 0.5)',
            text: '#ffff00',
            hover: 'rgba(255, 255, 0, 0.8)'
        },
        purple: {
            bg: 'linear-gradient(135deg, rgba(157, 0, 255, 0.2), rgba(127, 0, 255, 0.3))',
            border: 'rgba(157, 0, 255, 0.6)',
            shadow: 'rgba(157, 0, 255, 0.5)',
            text: '#9d00ff',
            hover: 'rgba(157, 0, 255, 0.8)'
        }
    };

    const sizeMap = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-12 py-6 text-xl'
    };

    const colors = colorMap[color];
    const sizeClasses = sizeMap[size];

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`
                relative overflow-hidden
                font-orbitron font-bold
                border-2 rounded-lg
                transition-all duration-300 transform
                hover:scale-105 active:scale-95
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${sizeClasses}
                ${className}
                ${glow ? 'animate-glow' : ''}
                ${pulse ? 'animate-pulse' : ''}
            `}
            style={{
                background: colors.bg,
                borderColor: colors.border,
                color: colors.text,
                boxShadow: glow ? `0 0 20px ${colors.shadow}, inset 0 0 20px ${colors.shadow}33` : `0 0 10px ${colors.shadow}33`,
                textShadow: `0 0 10px ${colors.shadow}`
            }}
        >
            {/* Animated shine effect */}
            <div className="absolute inset-0 opacity-30" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shine 3s ease-in-out infinite',
                backgroundSize: '200% 100%'
            }} />
            
            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center space-x-2">
                {children}
            </span>
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: colors.border }} />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: colors.border }} />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: colors.border }} />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: colors.border }} />
        </button>
    );
};

export default NeonButton;