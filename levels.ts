export interface Level {
    question: string;
    clues: string[]; // Each string in the array is a piece of the clue for one player
    answer: string;
    audioClue?: string; // Optional audio clue
    videoClue?: string; // Optional video clue
    timedClue?: { text: string; delay: number; }; // Optional timed clue
    secretEncodings?: string[]; // Optional array of secret texts
}

export const LEVELS: Level[] = [
    {
        question: "Decipher the auditory clue to unlock the first sequence.",
        clues: [
            "Answer Screen la Illai",
            "Thattungal Thirakkapadum",
        ],
        answer: "Naan Dhan Answer",
        audioClue: "/audio/vittupona_loop.mp3",
        secretEncodings: ["Base64"],
    },
    {
        question: "Decode the binary message to reveal the next phrase.",
        clues: [
            "Decoding therinja nee tha Pista",
            "Computer Pesum Mozhi \"01010011 01101001 01110010 01100001 01110000 01110000 01100001 01101110 01100001 00100000 01000001 01100001 01101100 00100000 01001110 01100101 01100101\"",
        ],
        answer: "Sirappana Aal Nee",
        audioClue: "/audio/poojiyam-ondrodu_loop.mp3",
        secretEncodings: ["binary"],
    },
    {
        question: "Watch the video evidence. Find the numbers and the QR Code.",
        clues: [
            "Numbers Mukkiyam Bigiluhh",
            "QR Code irukka nu endrichu paaru",
        ],
        answer: "Valthukkal Valthukkal",
        videoClue: "/video/kakki_sattai.mp4",
        secretEncodings: ["Hexa Decimal"],
    },
    {
        question: "Observe the external display (projector). Locate the hidden clues and uncover the truth.",
        clues: [
            "Adho paaru Dhoorathula Dolakpur Mala",
            "Suthi Paaru Answer 100",
            "Kannuku Munnaddi Theriyurathu ellame unmai illa Beti.",
        ],
        answer: "Avlo ariviu iruka super !",
        secretEncodings: ["ROT13"],
    },
    {
        question: "🏆 FINAL BOSS LEVEL 🏆 Samandhame illadha oru nerathula Samandhame illadhha edduthula, Samandhame illadha orunthan irundhan. Andha samandhame illadha oruthaan andha samandhame illadha eduthula samandhame illadha oru vishaayam thuni ku pinnadi irundhadha paathanam",
        clues: [
            "Andha thuni ku pinnadi ennava irukkum",
            "🚨 FINAL CLUE: This is the ultimate challenge - solve this to complete the mission!",
        ],
        answer: "Nee Dham uh ley Diveruhh",
        timedClue: { text: "Curtain = thuni", delay: 15 },
    },
];