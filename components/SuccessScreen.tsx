import React from 'react';

interface SuccessScreenProps {
    memeUrl: string;
    onProceed: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ memeUrl, onProceed }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 bg-opacity-90 backdrop-blur-sm">
            <h1 className="font-orbitron text-3xl md:text-5xl text-green-400 mb-4 animate-pulse">SUCCESS!</h1>
            <p className="text-lg text-slate-300 mb-6">Sequence Decrypted. Well done, agents.</p>
            <div className="relative bg-black p-2 rounded-lg shadow-2xl shadow-green-500/20 border border-green-400/30 max-w-2xl w-full">
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
                onClick={onProceed}
                className="font-orbitron mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-md text-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            >
                PROCEED TO NEXT SEQUENCE
            </button>
        </div>
    );
};

export default SuccessScreen;
