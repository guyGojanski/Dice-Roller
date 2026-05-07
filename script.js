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
  correctSuffix: " Correct! \\n Sum: ",
  wrongSuffix: " Wrong! \\n Sum: ",
  lostSuffix: " Lost",
  winnerLabel: " Winner: 🏆",
  bothLosersLabel: "Both Are Losers 😶‍🌫️",
};

const DOM = {
  rollBtn: document.getElementById("rollBtn"),
  diceContainer: document.querySelector(".dice-container"),
  gameInputs: document.querySelector(".game-inputs"),
  scoreboardsWrapper: document.querySelector(".scoreboards-wrapper"),
  matchTitle: document.querySelector(".match-title"),
  container: document.querySelector(".container"),
  targetSum: document.getElementById("targetSum"),
  diceCount: document.getElementById("diceCount"),
  resetBtn: document.getElementById("resetBtn"),
  resetGameBtn: document.getElementById("resetGameBtn"),
  turnIndicator: document.getElementById("turnIndicator"),
  currentPlayerName: document.getElementById("currentPlayerName"),
  maxRoundsDisplay: document.getElementById("maxRoundsDisplay"),
  currentRoundDisplay: document.getElementById("currentRoundDisplay"),
  playerWins: [
    document.getElementById("player1Wins"),
    document.getElementById("player2Wins"),
  ],
  playerLosses: [
    document.getElementById("player1Losses"),
    document.getElementById("player2Losses"),
  ],
  playerTitles: [
    document.getElementById("player1Title"),
    document.getElementById("player2Title"),
  ],
  playerGameOverMsgs: [
    document.getElementById("player1GameOverMsg"),
    document.getElementById("player2GameOverMsg"),
  ],
  roundResult: document.getElementById("roundResult"),
  playerBoards: [
    document.querySelector(".player-1-board"),
    document.querySelector(".player-2-board"),
  ],
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

const currentPlayer = () => state.players[state.turn];

const roundsCount = () =>
  state.players.reduce(
    (roundTotal, player) => roundTotal + player.wins + player.losses,
    0,
  );

const getBounds = () => {
  const diceCount = Number(DOM.diceCount.value) || CONFIG.defaultDiceCount;
  return {
    min: diceCount,
    max: diceCount * 6,
  };
};

const setButtonVisibility = (button, isVisible) => {
  button.style.display = isVisible ? "block" : "none";
};

const updateMatchTitle = () => {
  DOM.maxRoundsDisplay.innerText = Math.floor(CONFIG.maxRounds / 2);
  DOM.currentRoundDisplay.innerText = roundsCount() + 1;
};

const updateGuessInputBounds = () => {
  const { min, max } = getBounds();
  DOM.targetSum.min = String(min);
  DOM.targetSum.max = String(max);
  DOM.targetSum.placeholder = `${min}-${max}`;
};

const updateTurn = () => {
  const activePlayer = currentPlayer();
  DOM.turnIndicator.classList.remove("winner-turn");
  if (DOM.currentPlayerName && DOM.currentPlayerName.isConnected) {
    DOM.currentPlayerName.textContent = activePlayer.name;
  } else {
    DOM.turnIndicator.innerHTML = `<p><strong id="currentPlayerName">${activePlayer.name}</strong>${TEXT.playerTurnSuffix}</p>`;
    DOM.currentPlayerName =
      DOM.turnIndicator.querySelector("#currentPlayerName");
  }
  DOM.targetSum.value = activePlayer.lastGuess || "";
  updateGuessInputBounds();
  updateMatchTitle();
};

const updateScores = () => {
  state.players.forEach((player, index) => {
    DOM.playerWins[index].innerText = player.wins;
    DOM.playerLosses[index].innerText = player.losses;
  });
};

const updateNames = () => {
  state.players.forEach((player, index) => {
    DOM.playerTitles[index].innerText = player.name;
  });
};

const clearMessages = () => {
  DOM.playerGameOverMsgs.forEach((msgElement) => {
    msgElement.innerText = "";
  });
};

const hideButtons = () => {
  setButtonVisibility(DOM.resetBtn, false);
  setButtonVisibility(DOM.resetGameBtn, false);
};

const showButtons = () => {
  setButtonVisibility(DOM.resetBtn, true);
  setButtonVisibility(DOM.resetGameBtn, true);
};

const clearWinner = () => {
  DOM.turnIndicator.classList.remove("winner-turn");
  DOM.playerBoards.forEach((board) => {
    board.classList.remove("winner-board");
  });
  updateNames();
};

const resetOne = (player) => {
  player.wins = 0;
  player.losses = 0;
  player.lastGuess = "";
};

const resetGameData = () => {
  state.turn = 0;
  state.confettiCelebrated = false;
  state.players.forEach((player) => {
    resetOne(player);
  });
};

// Initialize the UI on page load
updateMatchTitle();
updateGuessInputBounds();
updateTurn();
hideButtons();
clearMessages();
updateScores();