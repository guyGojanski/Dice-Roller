"use strict";

const CONFIG = {
  defaultPlayerNames: ["Player 1", "Player 2"],
  defaultDiceCount: 2,
  winTarget: 3,
  maxRounds: 10,
  animation: {
    spinMs: 500,
    settleMs: 800,
    resultMs: 1400,
    winLeadMs: 150,
    confettiMs: 4000,
    matchConfettiMs: 3500,
  },
  diceFaceNames: ["front", "back", "top", "bottom", "right", "left"],
  diceRotations: [
    "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)",
    "rotateY(90deg) rotateX(0deg) rotateZ(0deg)",
    "rotateY(-90deg) rotateX(0deg) rotateZ(0deg)",
    "rotateX(90deg) rotateY(0deg) rotateZ(0deg)",
    "rotateX(-180deg) rotateY(0deg) rotateZ(0deg)",
  ],
  confettiColors: ["#ef1d8d", "#06c9f0", "#ffffff"],
  colors: {
    success: "#008000",
    error: "#ff0000",
  },
};

const TEXT = {
  needGuess: "Please enter a guess!",
  needNames: "Both players must enter their names to start the game!",
  invalidGuess: (min, max) => `Enter a whole number between ${min} and ${max}.`,
  outOfRangeGuess: (min, max) => `Enter a number between ${min} and ${max}.`,
  playerTurnSuffix: "'s Turn",
  correctSuffix: " Correct! \n Sum: ",
  wrongSuffix: " Wrong! \n Sum: ",
  lostSuffix: " Lost",
  winnerLabel: " Winner: 🏆",
  bothLosersLabel: "Both Are Losers 😶‍🌫️",
};

const state = {
  players: CONFIG.defaultPlayerNames.map((name) => ({
    name,
    wins: 0,
    losses: 0,
    lastGuess: "",
  })),
  turn: 0,
  confettiCelebrated: false,
};
