export interface Level {
    question: string;
    clues: string[]; // Each string in the array is a piece of the clue for one player
    answer: string;
}

export const LEVELS: Level[] = [
    {
        question: "Assemble the message and find the keyword.",
        clues: [
            "The package is secure.",
            "The code is 'phoenix'.",
            "Await further instructions.",
        ],
        answer: "phoenix",
    },
    {
        question: "Combine the parts of the coordinates and identify the location.",
        clues: [
            "Latitude: 48.8584° N",
            "Longitude: 2.2945° E",
            "This famous landmark is in Paris.",
        ],
        answer: "Eiffel Tower",
    },
    {
        question: "The agent's name is an anagram of these three words.",
        clues: [
            "A",
            "CLEAN",
            "PLATE",
        ],
        answer: "PETE ALAN C", // Just an example anagram
    },
    {
        question: "Follow the sequence to find the next number.",
        clues: [
            "The sequence begins with 2, 3, 5, 7...",
            "...followed by 11, 13, 17...",
            "...what is the next number?",
        ],
        answer: "19",
    },
];
