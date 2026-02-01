import React from 'react';

interface SecretPayloadProps {
    text: string;
    position: { top: string; left: string; };
}

const SecretPayload: React.FC<SecretPayloadProps> = ({ text, position }) => {
    return (
        <div
            className="fixed z-50 bg-red-500/80 text-white font-mono p-2 rounded-md shadow-lg animate-pulse backdrop-blur-sm"
            style={{ 
                top: position.top, 
                left: position.left,
                transform: 'translate(-50%, -50%)' // Center the element on the random coordinates
            }}
        >
            <p className="text-sm">-- SECRET PAYLOAD --</p>
            <p className="text-lg font-bold">{text}</p>
        </div>
    );
};

export default SecretPayload;
