
import { Suspect, FileSystem } from './types';

export const TOTAL_LEVELS = 5;

// Level 1: Caesar Cipher
export const CAESAR_CIPHER_TEXT = "J mpwf zpv! Uif tfdsfu jt: Hp up uif hbsefo bu 10. Cvu gps uijt hbnf, uif dpef jt 'gsjfoet'.";
export const CAESAR_CIPHER_SHIFT = -1; // Decodes to "I love you!..." with code 'friends'
export const CAESAR_CIPHER_ANSWER = "friends";

// Level 2: Watermark Hunt
export const MEME_WATERMARK_URL = "https://i.imgflip.com/4/30b1tz.jpg"; // Drake Hotline Bling meme
export const MEME_WATERMARK_ANSWER = "pc-42.zip";

// Level 3: PC Hopping
export const PC_KEYWORD_ANSWER = "MUTHU_PARISU";

// Level 4: Social Engineering
export const SUSPECTS: Suspect[] = [
  { id: 1, name: "Goundamani", image: "https://i.ytimg.com/vi/i2rI2a6oYh0/hqdefault.jpg", dm: "You cracked level 3. Can you crack my heart?" },
  { id: 2, name: "Vadivelu", image: "https://i.ytimg.com/vi/vCKy68S0BRA/hqdefault.jpg", dm: "That was some elite hacking... are you free later?" },
  { id: 3, name: "Senthil", image: "https://www.behindwoods.com/tamil-movies/slideshow/10-most-wanted-on-screen-pairs-of-tamil-cinema/images/goundamani-senthil.jpg", dm: "I saw what you did there... impressive. Let's connect." },
  { id: 4, name: "Vivek", image: "https://pbs.twimg.com/media/DBuUvFjVwAA3h3A.jpg", dm: "Hey hacker, nice skills. My DMs are always open for talented people." },
];
export const CORRECT_SUSPECT_ID = 2; // Vadivelu

// Level 5: Vault Breaker
export const VAULT_PASSWORD = "MEME_KING";
export const FINAL_FLAG = "FLAG{CYBERKING_2025}";
export const FILE_SYSTEM: FileSystem = {
  'My_Computer': {
    type: 'folder',
    content: {
      'C_Drive': {
        type: 'folder',
        content: {
          'Program_Files': { type: 'folder', content: {} },
          'Users': {
            type: 'folder',
            content: {
              'Admin': {
                type: 'folder',
                content: {
                  'Desktop': { type: 'folder', content: {} },
                  'Documents': {
                    type: 'folder',
                    content: {
                      'passwords_final.txt': { type: 'file', content: 'Old passwords:\n123456\npassword\nqwerty' },
                      'dont_open_this.exe': { type: 'file', content: 'Nice try! But the flag is not here. Keep looking!' },
                    }
                  },
                  'Downloads': {
                    type: 'folder',
                    content: {
                      'Festival_Parisu.zip': { type: 'file', content: 'A zip file containing... nothing useful.' }
                    }
                  }
                }
              }
            }
          },
          'hidden_memevault': {
            type: 'folder',
            content: {
              'clue.png': { type: 'image', content: 'https://i.kym-cdn.com/entries/icons/original/000/012/132/thatsthejoke.jpg' }, // "That's the joke" image, implying a red herring
              'the_key.png': { type: 'image', content: 'https://i.imgur.com/kdkL34E.png' }, // An image with "MEME_KING" faintly watermarked
            }
          }
        }
      },
      'D_Drive': {
        type: 'folder',
        content: {
          'final_code.txt.enc': { type: 'locked', content: 'This file is encrypted. Enter password to unlock.' }
        }
      }
    }
  }
};


// Meme URLs for feedback
export const MEME_LOVE_AH = "https://media.tenor.com/2oA6yY5A5ZMAAAAC/vadivelu-love.gif";
export const MEME_HACKER_AH = "https://www.memestemplates.in/uploads/1638686676.jpeg";
export const MEME_ANUBAVAM = "https://i.ytimg.com/vi/3nMuNA-mI6A/sddefault.jpg";
export const MEME_LAB_LOVE = "https://memes.co.in/memes/update/uploads/2021/05/3-4-1024x1024.jpg";
export const JUMPSCARE_SOUND_URL = "https://www.myinstants.com/media/sounds/fnaf-jumpscare-sound.mp3";
export const SUCCESS_SOUND_URL = "https://www.myinstants.com/media/sounds/success-sound-effect.mp3";
export const FINAL_SUCCESS_URL = "https://media.tenor.com/E13i61v41LIAAAAC/confetti-congratulations.gif";

// Certificate Generator
export const HACKER_ADJECTIVES = ["Digital", "Cyber", "Anonymous", "Shadow", "Quantum", "Phantom", "Giga", "Binary", "Viral"];
export const HACKER_NOUNS = ["Ghost", "Ninja", "Overlord", "Samurai", "Spectre", "Phoenix", "Voyager", "Rogue", "Wizard"];
