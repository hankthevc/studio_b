const categories = {
  logic: {
    chill: [
      {
        prompt: "Three friends sit in a row. Alex is not on the left. Jamie isn’t in the middle. Who sits in the middle?",
        answer: "Casey",
        hint: "Eliminate left + middle placements first.",
        choices: ["Alex", "Casey", "Jamie", "No one"]
      },
      {
        prompt: "I am an odd number. Take away a letter and I become even. What number am I?",
        answer: "Seven",
        hint: "Think about the word itself.",
        choices: ["Seven", "Eleven", "Nine", "Five"]
      }
    ],
    tricky: [
      {
        prompt: "You have a 5-minute and a 2-minute hourglass. How do you time exactly 7 minutes?",
        answer: "Start both. When 2-min empties, flip it. When 5-min empties, flip it; when 2-min empties again, 7 minutes passed.",
        hint: "Use overlapping flips.",
        choices: null
      },
      {
        prompt: "What comes next: O, T, T, F, F, S, S, ...",
        answer: "E (Eight)",
        hint: "Count up.",
        choices: ["E", "N", "T", "O"]
      }
    ],
    spicy: [
      {
        prompt: "A liar says: “Exactly one of us is lying.” How many liars are there?",
        answer: "All of them",
        hint: "Assume statement true or false.",
        choices: ["0", "1", "2", "All of them"]
      },
      {
        prompt: "The day before yesterday, Chris was 17. Next year, he will be 20. What date is it?",
        answer: "Jan 1st (Birthday was Dec 31)",
        hint: "Look for a calendar edge case.",
        choices: ["Jan 1st", "Feb 29th", "Dec 31st", "July 4th"]
      }
    ]
  },
  trivia: {
    chill: [
      {
        prompt: "Which planet in our solar system has the most moons?",
        answer: "Saturn",
        hint: "It recently surpassed Jupiter.",
        choices: ["Earth", "Jupiter", "Saturn", "Neptune"]
      }
    ],
    tricky: [
      {
        prompt: "Which artist painted 'Girl with a Pearl Earring'?",
        answer: "Johannes Vermeer",
        hint: "Dutch master of light.",
        choices: ["Rembrandt", "Johannes Vermeer", "Van Gogh", "Monet"]
      }
    ],
    spicy: [
      {
        prompt: "What is the only country that’s also a continent?",
        answer: "Australia",
        hint: "Island nation.",
        choices: ["Greenland", "Australia", "Madagascar", "Indonesia"]
      }
    ]
  },
  pattern: {
    chill: [
      {
        prompt: "Complete the sequence: 2, 4, 8, 16, __",
        answer: "32",
        hint: "Multiply by 2.",
        choices: ["20", "24", "32", "64"]
      }
    ],
    tricky: [
      {
        prompt: "Complete the sequence: 1, 2, 4, 7, 11, __",
        answer: "16",
        hint: "Differences increase by 1.",
        choices: ["14", "16", "18", "21"]
      }
    ],
    spicy: [
      {
        prompt: "Complete: 3, 9, 27, 81, __",
        answer: "243",
        hint: "Powers of three.",
        choices: ["162", "243", "324", "999"]
      }
    ]
  },
  wordplay: {
    chill: [
      {
        prompt: "Unscramble to form a word: RAIN + BOW",
        answer: "Rainbow",
        hint: "Weather + color.",
        choices: null
      }
    ],
    tricky: [
      {
        prompt: "What word becomes shorter when you add two letters?",
        answer: "Short",
        hint: "Think literal.",
        choices: ["Small", "Short", "Tiny", "Brief"]
      }
    ],
    spicy: [
      {
        prompt: "Remove one letter from 'SEVENTY' to make it even.",
        answer: "Seventy without S is 'eventy' (still 'even').",
        hint: "Focus on letter removal.",
        choices: null
      }
    ]
  }
};

export function planPuzzle(formValues = {}) {
  const normalized = normalizeForm(formValues);
  const cat = categories[normalized.category] || categories.logic;
  const pool = cat[normalized.difficulty] || cat.chill;
  const puzzle = pool[Math.floor(Math.random() * pool.length)];

  const type = normalized.puzzleType;
  const choices = type === "choice" ? puzzle.choices || buildChoices(puzzle.answer) : null;

  return {
    prompt: puzzle.prompt,
    answer: puzzle.answer,
    hint: puzzle.hint,
    type,
    choices,
    streak: buildStreak(normalized.difficulty),
    shareLink: buildShareLink(normalized.category)
  };
}

function buildChoices(answer) {
  const decoys = ["Option A", "Option B", "Option C"];
  const options = [answer, ...decoys].slice(0, 4);
  return shuffle(options);
}

function buildStreak(difficulty) {
  const base = difficulty === "chill" ? 3 : difficulty === "tricky" ? 5 : 7;
  const delta = Math.floor(Math.random() * 3);
  return {
    count: base + delta,
    status: base + delta >= 5 ? "🔥 Hot streak" : "Building momentum"
  };
}

function buildShareLink(category) {
  const slug = category.replace(/[^a-z]/gi, "").toLowerCase() || "puzzle";
  const id = Math.random().toString(36).slice(2, 5);
  return `https://brainbite.fun/s/${slug}-${id}`;
}

function normalizeForm(form = {}) {
  return {
    category: categories[form.category] ? form.category : "logic",
    difficulty: ["chill", "tricky", "spicy"].includes(form.difficulty) ? form.difficulty : "chill",
    puzzleType: form.puzzleType === "choice" ? "choice" : "free"
  };
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
