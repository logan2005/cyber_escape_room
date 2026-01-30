import React from 'react';

interface MemePlayerProps {
    videoUrl: string;
    onClose: () => void;
}

const MemePlayer: React.FC<MemePlayerProps> = ({ videoUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-black p-2 rounded-lg shadow-2xl shadow-cyan-500/20 border border-cyan-400/30"
                onClick={(e) => e.stopPropagation()}
            >
                <video 
                    key={videoUrl}
                    src={videoUrl}
                    autoPlay
                    controls
                    className="max-w-[90vw] max-h-[80vh] rounded"
                />
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-extrabold w-10 h-10 rounded-full flex items-center justify-center text-2xl border-2 border-slate-900"
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default MemePlayer;
