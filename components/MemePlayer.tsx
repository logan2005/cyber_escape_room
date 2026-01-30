import React from 'react';

interface MemePlayerProps {
    videoUrl: string;
    onClose: () => void;
}

const MemePlayer: React.FC<MemePlayerProps> = ({ videoUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={onClose} // Close when clicking the backdrop
        >
            <div 
                className="relative bg-black p-4 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the video container
            >
                <video 
                    key={videoUrl} // Use key to force re-render when the URL changes
                    src={videoUrl}
                    autoPlay
                    controls
                    className="max-w-full max-h-[80vh]"
                />
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 mt-2 mr-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-full"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default MemePlayer;
