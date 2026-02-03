import React from 'react';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    glowing?: boolean;
    neonColor?: 'cyan' | 'pink' | 'green' | 'yellow' | 'purple';
    title?: string;
    icon?: React.ReactNode;
    floating?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    className = '',
    glowing = false,
    neonColor = 'cyan',
    title,
    icon,
    floating = false
}) => {
    const colorMap = {
        cyan: 'rgba(0, 255, 255, 0.3)',
        pink: 'rgba(255, 0, 255, 0.3)',
        green: 'rgba(0, 255, 0, 0.3)',
        yellow: 'rgba(255, 255, 0, 0.3)',
        purple: 'rgba(157, 0, 255, 0.3)'
    };

    const borderColor = colorMap[neonColor];

    return (
        <div className={`
            relative
            backdrop-blur-xl
            rounded-2xl
            border
            ${glowing ? 'animate-glow' : ''}
            ${floating ? 'animate-float' : ''}
            transition-all duration-300
            ${className}
        `}
        style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: borderColor,
            boxShadow: glowing 
                ? `0 8px 32px ${borderColor}, inset 0 0 32px ${borderColor}22`
                : '0 8px 32px rgba(0, 255, 255, 0.1), inset 0 0 32px rgba(255, 255, 255, 0.02)'
        }}
        >
            {/* Animated overlay */}
            <div className="absolute inset-0 rounded-2xl opacity-20" style={{
                background: `linear-gradient(135deg, ${borderColor}11, transparent 50%, ${borderColor}11)`,
                animation: 'hologram 6s ease-in-out infinite'
            }} />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor }} />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8">
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor }} />
            </div>
            <div className="absolute bottom-0 left-0 w-8 h-8">
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor }} />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8">
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor }} />
            </div>

            {/* Header section */}
            {(title || icon) && (
                <div className="flex items-center justify-between p-6 pb-4 border-b" style={{ borderColor: `${borderColor}33` }}>
                    <div className="flex items-center space-x-3">
                        {icon && (
                            <div className="text-2xl" style={{ color: borderColor.replace('0.3', '1') }}>
                                {icon}
                            </div>
                        )}
                        {title && (
                            <h2 className="font-orbitron text-xl font-bold" style={{ 
                                color: borderColor.replace('0.3', '1'),
                                textShadow: `0 0 10px ${borderColor.replace('0.3', '0.8')}`
                            }}>
                                {title}
                            </h2>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6">
                {children}
            </div>

            {/* Data streams effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-px h-8"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: borderColor,
                            animation: `dataStream ${2 + Math.random() * 3}s linear infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default GlassPanel;