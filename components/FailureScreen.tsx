import React from 'react';

interface FailureScreenProps {
    memeUrl: string;
    onTryAgain: () => void;
}

const FailureScreen: React.FC<FailureScreenProps> = ({ memeUrl, onTryAgain }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 bg-opacity-90 backdrop-blur-sm">
            <h1 className="font-orbitron text-3xl md:text-5xl text-red-400 mb-4 animate-pulse">FAILURE</h1>
            <p className="text-lg text-slate-300 mb-6">Access Denied. Anomaly detected. Re-evaluate and try again.</p>
            <div className="relative bg-black p-2 rounded-lg shadow-2xl shadow-red-500/20 border border-red-400/30 max-w-2xl w-full">
                <video 
                    key={memeUrl}
                    src={memeUrl}
                    autoPlay
                    loop
                    controls
                    className="w-full rounded"
                />
            </div>
            <button
                onClick={onTryAgain}
                className="font-orbitron mt-8 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-md text-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50"
            >
                RE-EVALUATE
            </button>
        </div>
    );
};

export default FailureScreen;
