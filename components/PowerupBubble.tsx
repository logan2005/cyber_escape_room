import React from 'react';

interface PowerupBubbleProps {
    onClick: () => void;
    position: { top: string; left: string; };
}

const PowerupBubble: React.FC<PowerupBubbleProps> = ({ onClick, position }) => {
    return (
        <div
            className="fixed z-[9999] flex items-center justify-center w-20 h-20 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(0,150,255,0.6) 100%)',
                boxShadow: '0 0 15px 5px rgba(0, 255, 255, 0.4), 0 0 30px 10px rgba(0, 150, 255, 0.3)',
                animation: 'pop-in 0.3s ease-out, pulse-bubble 2s infinite 0.3s',
            }}
            onClick={onClick}
        >
            <span className="font-orbitron text-white text-sm font-bold text-shadow">GRAB</span>
            <style>
                {`
                    @keyframes pop-in {
                        0% { transform: translate(-50%, -50%) scale(0); }
                        100% { transform: translate(-50%, -50%) scale(1); }
                    }
                    @keyframes pulse-bubble {
                        0% { transform: translate(-50%, -50%) scale(0.95); }
                        70% { transform: translate(-50%, -50%) scale(1.05); }
                        100% { transform: translate(-50%, -50%) scale(0.95); }
                    }
                `}
            </style>
        </div>
    );
};

export default PowerupBubble;
