
export interface GameState {
  level: number;
  playerName: string;
  pcAssignment: number | null;
}

export interface LevelProps {
  onComplete: () => void;
  setPlayerName: (name: string) => void;
  playerName: string;
  pcAssignment: number | null;
  setPcAssignment: (pc: number) => void;
}

export interface Suspect {
  id: number;
  name: string;
  image: string;
  dm: string;
}

export type FileSystemItem = {
  type: 'folder' | 'file' | 'image' | 'locked';
  content?: string | FileSystem;
};

export type FileSystem = {
  [key: string]: FileSystemItem;
};
