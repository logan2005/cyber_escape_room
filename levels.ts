export interface Level {
    question: string;
    clues: string[]; // Each string in the array is a piece of the clue for one player
    answer: string;
}

export const LEVELS: Level[] = [
    {
        question: "A popular front-end library asks: 'What is the answer to the ultimate question of life, the universe, and everything?'",
        clues: [
            "The library's logo is a blue atom.",
            "It was created by Facebook.",
            "The answer is a number from 'The Hitchhiker's Guide to the Galaxy'.",
        ],
        answer: "42",
    },
    {
        question: "This git command is used to save your work, but what is its most common 'message'?",
        clues: [
            "It's not 'save' or 'update'.",
            "You use it after 'git add .'.",
            "The message is often a short, unhelpful description of the changes.",
        ],
        answer: "wip", // Work in Progress - a classic lazy commit message
    },
    {
        question: "In the world of cybersecurity, what type of 'hat' is a hacker who works to find vulnerabilities for the greater good?",
        clues: [
            "Their counterpart is a 'black hat'.",
            "They are often hired by companies to test their own systems.",
            "The color of their 'hat' is associated with purity and heroes.",
        ],
        answer: "white",
    },
    {
        question: "What three letters are famously used to escape from a popular, notoriously difficult-to-quit text editor?",
        clues: [
            "The editor is called Vim.",
            "You must be in normal mode first.",
            "It's a colon, a letter, and an exclamation mark!",
        ],
        answer: ":q!",
    },
    {
        question: "What is the term for a bug that unexpectedly becomes a feature?",
        clues: [
            "It's not a 'glitch' or a 'mistake'.",
            "The original 'bug' in computing was a literal moth.",
            "It's a common joke among developers, 'It's not a bug, it's a ___'.",
        ],
        answer: "feature",
    },
];