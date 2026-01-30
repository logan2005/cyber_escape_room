
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Input, Modal } from './common/UIElements';
import type { LevelProps, Suspect, FileSystem, FileSystemItem } from '../types';
import {
  CAESAR_CIPHER_TEXT, CAESAR_CIPHER_ANSWER,
  MEME_WATERMARK_URL, MEME_WATERMARK_ANSWER, PC_KEYWORD_ANSWER,
  SUSPECTS, CORRECT_SUSPECT_ID,
  VAULT_PASSWORD, FINAL_FLAG, FILE_SYSTEM,
  MEME_LOVE_AH, MEME_HACKER_AH, MEME_ANUBAVAM, MEME_LAB_LOVE,
  FINAL_SUCCESS_URL, HACKER_ADJECTIVES, HACKER_NOUNS,
  JUMPSCARE_SOUND_URL, SUCCESS_SOUND_URL
} from '../constants';
import Confetti from 'react-confetti';

// --- Helper Functions & Hooks ---

const useAudio = (url: string) => {
  const audio = useMemo(() => new Audio(url), [url]);
  const play = () => {
    audio.play().catch(e => console.error("Audio play failed", e));
  };
  return play;
};

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};


// --- Welcome Screen ---

export const WelcomeScreen: React.FC<Pick<LevelProps, 'onComplete' | 'setPlayerName'>> = ({ onComplete, setPlayerName }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setPlayerName(name.trim());
      onComplete();
    }
  };

  return (
    <Card className="text-center animate-fade-in">
      <h1 className="text-4xl font-bold font-orbitron text-cyan-400 mb-2">Cyber Treasure Hunt</h1>
      <p className="text-gray-400 mb-6">Enter the digital realm. Prove your skills. Become a legend.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        <Input
          placeholder="Enter your name, agent..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-sm text-center"
        />
        <Button type="submit" disabled={!name.trim()}>Begin Mission</Button>
      </form>
    </Card>
  );
};

// --- Level 1: Caesar Cipher ---

export const Level1: React.FC<LevelProps> = ({ onComplete }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (answer.trim().toLowerCase() === CAESAR_CIPHER_ANSWER) {
      setError('');
      onComplete();
    } else {
      setError('Love ah? Nee hacker da!');
    }
  };

  return (
    <Card className="text-center animate-fade-in">
      <h2 className="text-2xl font-bold font-orbitron text-red-500 mb-4">Level 1: Caesar Love Letter Trap</h2>
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
        <p className="italic text-yellow-300">{CAESAR_CIPHER_TEXT}</p>
      </div>
      <p className="text-gray-400 mb-4">A romantic message intercepted... but it's a trap! Decode the keyword hidden within.</p>
      <div className="flex flex-col items-center gap-4">
        <Input
          placeholder="Enter the decoded keyword"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit}>Decode</Button>
        {error && (
          <div className="mt-4 text-center">
             <p className="text-red-500 text-lg mb-2">{error}</p>
             <img src={MEME_LOVE_AH} alt="Vadivelu Meme" className="mx-auto rounded-lg w-64" />
          </div>
        )}
      </div>
    </Card>
  );
};


// --- Level 2: Meme Watermark ---

export const Level2: React.FC<LevelProps> = ({ onComplete }) => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (answer.trim().toLowerCase() === MEME_WATERMARK_ANSWER) {
            setError(false);
            onComplete();
        } else {
            setError(true);
        }
    };
    
    return (
        <Card className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold font-orbitron text-yellow-500 mb-4">Level 2: Meme Watermark Hunt</h2>
            <p className="text-gray-400 mb-4">A classic meme holds the next clue. Look closer... what's hiding in plain sight?</p>
            <div className="relative mb-4 group">
              <img src={MEME_WATERMARK_URL} alt="Meme with clue" className="mx-auto rounded-lg max-w-sm w-full" />
              <div className="absolute bottom-2 right-2 text-white/10 text-xs group-hover:text-white/50 transition-colors">
                {MEME_WATERMARK_ANSWER}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <Input
                    placeholder="Enter the hidden file name"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button onClick={handleSubmit}>Submit</Button>
                {error && (
                    <div className="mt-4 text-center">
                        <p className="text-red-500 text-lg mb-2">Wrong! Nee dhaan hacker ah?</p>
                        <img src={MEME_HACKER_AH} alt="Hacker meme" className="mx-auto rounded-lg w-64" />
                    </div>
                )}
            </div>
        </Card>
    );
};


// --- Level 3: PC Hopping ---

export const Level3: React.FC<LevelProps> = ({ onComplete, pcAssignment, setPcAssignment }) => {
    const [keyword, setKeyword] = useState('');
    const [error, setError] = useState(false);
    const [showPuzzle, setShowPuzzle] = useState(false);
    
    useEffect(() => {
        if (!pcAssignment) {
            const randomPC = Math.floor(Math.random() * 80) + 1;
            setPcAssignment(randomPC);
        }
    }, [pcAssignment, setPcAssignment]);

    const handleSubmit = () => {
        if (keyword.trim().toUpperCase() === PC_KEYWORD_ANSWER) {
            setError(false);
            onComplete();
        } else {
            setError(true);
        }
    };

    return (
        <Card className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold font-orbitron text-green-500 mb-4">Level 3: PC Hopping Puzzle</h2>
            {!showPuzzle ? (
                <>
                    <p className="text-gray-400 mb-6">Your next clue isn't on this device. You need to move.</p>
                    <Button onClick={() => setShowPuzzle(true)}>Reveal Mission</Button>
                </>
            ) : (
                <div className="animate-fade-in">
                    <p className="text-gray-300 mb-2">Your target is:</p>
                    <p className="text-6xl font-orbitron text-green-400 animate-pulse mb-6">PC-{pcAssignment}</p>
                    <p className="text-gray-400 mb-4">Walk to the assigned lab PC. Find the encrypted file. Solve the puzzle to get the keyword and enter it here.</p>
                     <div className="flex flex-col items-center gap-4">
                        <Input
                            placeholder="Enter keyword from PC"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <Button onClick={handleSubmit}>Verify Keyword</Button>
                        {error && <p className="mt-4 text-red-500">Incorrect keyword. Double-check the file on the PC.</p>}
                    </div>
                </div>
            )}
        </Card>
    );
};

// --- Level 4: Social Engineering ---

export const Level4: React.FC<LevelProps> = ({ onComplete }) => {
    const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
    const [feedback, setFeedback] = useState('');
    const [feedbackImg, setFeedbackImg] = useState('');

    const handleSuspectSelect = (suspect: Suspect) => {
        setFeedback('');
        setFeedbackImg('');
        setSelectedSuspect(suspect);
    };

    const handleDMResponse = (accepted: boolean) => {
        if (!selectedSuspect) return;

        if (selectedSuspect.id === CORRECT_SUSPECT_ID && !accepted) {
            onComplete();
        } else if (selectedSuspect.id !== CORRECT_SUSPECT_ID) {
            setFeedback('Wrong suspect! Idhu da anubavam...');
            setFeedbackImg(MEME_ANUBAVAM);
            setSelectedSuspect(null);
        } else { // Correct suspect, but accepted DM
            setFeedback('Love ah? Lab la? You fell for the trap!');
            setFeedbackImg(MEME_LAB_LOVE);
            setSelectedSuspect(null);
        }
    };

    return (
        <Card className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold font-orbitron text-purple-500 mb-2">Level 4: Cyber Love Trap</h2>
            <p className="text-gray-400 mb-6">A fake virus alert was triggered. One of these suspects is the social engineer. Who is it?</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {SUSPECTS.map(suspect => (
                    <div key={suspect.id} onClick={() => handleSuspectSelect(suspect)} className="cursor-pointer border-2 border-transparent hover:border-purple-500 hover:scale-105 transition-transform rounded-lg p-2 bg-gray-700">
                        <img src={suspect.image} alt={suspect.name} className="w-full h-32 object-cover rounded-md" />
                        <p className="mt-2 font-bold">{suspect.name}</p>
                    </div>
                ))}
            </div>

            {feedback && (
                <div className="my-4 text-center">
                    <p className="text-red-500 text-lg mb-2">{feedback}</p>
                    {feedbackImg && <img src={feedbackImg} alt="Meme roast" className="mx-auto rounded-lg w-64" />}
                </div>
            )}

            <Modal isOpen={!!selectedSuspect} onClose={() => setSelectedSuspect(null)} title="Incoming DM...">
                {selectedSuspect && (
                    <div className="text-center">
                        <img src={selectedSuspect.image} alt={selectedSuspect.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-4" />
                        <p className="italic text-lg text-cyan-300 mb-6">"{selectedSuspect.dm}"</p>
                        <div className="flex justify-center gap-4">
                            <Button variant="primary" onClick={() => handleDMResponse(true)}>Accept</Button>
                            <Button variant="danger" onClick={() => handleDMResponse(false)}>Reject</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

// --- Level 5: Vault Breaker ---

const FileSystemViewer: React.FC<{onSuccess: () => void}> = ({onSuccess}) => {
    const [currentPath, setCurrentPath] = useState<string[]>(['My_Computer']);
    const [history, setHistory] = useState<string[][]>([['My_Computer']]);
    const [feedback, setFeedback] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [password, setPassword] = useState('');
    const [showImageViewer, setShowImageViewer] = useState<string | null>(null);

    const playJumpscare = useAudio(JUMPSCARE_SOUND_URL);

    const getCurrentContent = () => {
        let current = FILE_SYSTEM;
        for (const part of currentPath) {
            const content = (current[part] as FileSystemItem).content;
            if (typeof content !== 'object' || content === null) {
              return {}; // Should not happen with folders
            }
            current = content as FileSystem;
        }
        return current;
    };

    const handleItemClick = (name: string, item: FileSystemItem) => {
        setFeedback('');
        if (item.type === 'folder') {
            const newPath = [...currentPath, name];
            setCurrentPath(newPath);
            setHistory([...history, newPath]);
        } else if (item.type === 'file') {
            setFeedback(`Content of ${name}: ${item.content}`);
            if(name === 'dont_open_this.exe') playJumpscare();
        } else if (item.type === 'image') {
            setShowImageViewer(item.content as string);
        } else if (item.type === 'locked') {
            setIsLocked(true);
        }
    };

    const handleBack = () => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
            setCurrentPath(newHistory[newHistory.length - 1]);
        }
    };

    const handlePasswordSubmit = () => {
        if (password.trim() === VAULT_PASSWORD) {
            onSuccess();
        } else {
            setFeedback('Incorrect password. Access denied.');
            playJumpscare();
            setPassword('');
            setIsLocked(false);
        }
    };
    
    const items = getCurrentContent();
    const pathString = currentPath.join(' > ');

    return (
        <div className="w-full h-full bg-gray-900 border-2 border-gray-700 rounded-lg p-4 font-mono text-sm">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-700">
                <button onClick={handleBack} disabled={history.length <= 1} className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600">Back</button>
                <div className="text-gray-400">{pathString}</div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {Object.entries(items).map(([name, item]) => (
                    <div key={name} onClick={() => handleItemClick(name, item)} className="flex flex-col items-center text-center cursor-pointer hover:bg-gray-700 p-2 rounded-md">
                        <div className="text-4xl mb-1">
                            {item.type === 'folder' && '📁'}
                            {item.type === 'file' && '📄'}
                            {item.type === 'image' && '🖼️'}
                            {item.type === 'locked' && '🔒'}
                        </div>
                        <span className="break-all text-xs">{name}</span>
                    </div>
                ))}
            </div>
            {feedback && <p className="mt-4 text-yellow-300 p-2 bg-black/30 rounded">{`> ${feedback}`}</p>}

            <Modal isOpen={isLocked} onClose={() => setIsLocked(false)} title="Encryption Detected">
                <div className="flex flex-col gap-4 items-center">
                    <p>Enter password to decrypt file:</p>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..." />
                    <Button onClick={handlePasswordSubmit}>Unlock</Button>
                </div>
            </Modal>
             <Modal isOpen={!!showImageViewer} onClose={() => setShowImageViewer(null)} title="Image Viewer">
                {showImageViewer && <img src={showImageViewer} alt="clue" className="w-full rounded-lg" />}
            </Modal>
        </div>
    );
};

export const Level5: React.FC<LevelProps> = ({ onComplete }) => {
    return (
        <Card className="text-center animate-fade-in w-full max-w-4xl">
            <h2 className="text-2xl font-bold font-orbitron text-red-700 mb-2">Level 5: Cyber Heist - Vault Breaker</h2>
            <p className="text-gray-400 mb-4">You're in the system. The final flag is in a locked file. Find the password and break the vault!</p>
            <div className="h-[50vh] min-h-[400px]">
                <FileSystemViewer onSuccess={onComplete} />
            </div>
        </Card>
    );
};


// --- Game Complete Screen ---

export const GameComplete: React.FC<Pick<LevelProps, 'playerName'>> = ({ playerName }) => {
    const { width, height } = useWindowSize();
    const playSuccess = useAudio(SUCCESS_SOUND_URL);
    const [hackerName, setHackerName] = useState('');

    useEffect(() => {
        playSuccess();
        const adj = HACKER_ADJECTIVES[Math.floor(Math.random() * HACKER_ADJECTIVES.length)];
        const noun = HACKER_NOUNS[Math.floor(Math.random() * HACKER_NOUNS.length)];
        setHackerName(`${adj} ${noun}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative text-center">
            <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
            <Card className="animate-fade-in">
                <h1 className="text-4xl font-bold font-orbitron text-green-400 mb-4">MISSION COMPLETE!</h1>
                <img src={FINAL_SUCCESS_URL} alt="Success" className="mx-auto rounded-lg w-72 mb-4" />
                <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-4 my-6 inline-block">
                    <p className="text-2xl font-mono tracking-widest">{FINAL_FLAG}</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-1 rounded-lg">
                    <div className="bg-gray-800 p-6 rounded-md">
                        <p className="text-sm text-gray-400">This certifies that</p>
                        <p className="text-3xl font-bold text-yellow-300 my-2">{playerName}</p>
                        <p className="text-sm text-gray-400">has earned the title of</p>
                        <p className="text-2xl font-orbitron text-cyan-400 mt-2">{hackerName}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
