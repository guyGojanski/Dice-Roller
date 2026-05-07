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

const DOM = {
  rollBtn: document.getElementById("rollBtn"),
  diceContainer: document.querySelector(".dice-container"),
  gameInputs: document.querySelector(".game-inputs"),
  scoreboardsWrapper: document.querySelector(".scoreboards-wrapper"),
  matchTitle: document.querySelector(".match-title"),
  container: document.querySelector(".container"),
  diceSound: document.getElementById("diceSound"),
  winSound: document.getElementById("winSound"),
  loseSound: document.getElementById("loseSound"),
  nameModal: document.getElementById("nameModal"),
  startGameBtn: document.getElementById("startGameBtn"),
  player1NameInput: document.getElementById("player1Name"),
  player2NameInput: document.getElementById("player2Name"),
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

const resetScreen = ({
  showNameModal = false,
  clearNameInputs = false,
} = {}) => {
  if (clearNameInputs) {
    DOM.player1NameInput.value = "";
    DOM.player2NameInput.value = "";
  }

  DOM.nameModal.classList.toggle("hidden", !showNameModal);
  DOM.roundResult.innerText = "";
  DOM.roundResult.style.display = "block";
  DOM.targetSum.value = "";
  DOM.targetSum.placeholder = "?";
  hideButtons();

  DOM.diceContainer.style.display = "flex";
  DOM.gameInputs.style.display = "flex";
  DOM.scoreboardsWrapper.style.display = "flex";
  DOM.matchTitle.style.display = "block";
  DOM.container.style.background = "var(--color-card-bg)";
  DOM.container.style.boxShadow = "var(--shadow-soft)";

  DOM.diceCount.value = String(CONFIG.defaultDiceCount);
  clearMessages();
  clearWinner();
  updateNames();
  updateScores();
  createDice(CONFIG.defaultDiceCount);
  updateTurn();
  DOM.rollBtn.disabled = false;
};

const validateGuess = (rawValue) => {
  const trimmedValue = String(rawValue).trim();
  const { min, max } = getBounds();

  if (!trimmedValue) {
    return { valid: false, message: TEXT.needGuess };
  }

  const guess = Number(trimmedValue);
  if (!Number.isInteger(guess)) {
    return { valid: false, message: TEXT.invalidGuess(min, max) };
  }

  if (guess < min || guess > max) {
    return { valid: false, message: TEXT.outOfRangeGuess(min, max) };
  }

  return { valid: true, guess };
};

const showError = (message) => {
  DOM.roundResult.style.color = CONFIG.colors.error;
  DOM.roundResult.innerText = message;
};

const showRound = ({ playerName, total, isCorrect }) => {
  DOM.roundResult.style.color = isCorrect
    ? CONFIG.colors.success
    : CONFIG.colors.error;
  DOM.roundResult.innerText = `${playerName}${isCorrect ? TEXT.correctSuffix : TEXT.wrongSuffix}${total}`;
};

const createDice = (count) => {
  DOM.diceContainer.innerHTML = "";
  for (let index = 0; index < count; index++) {
    const dice = document.createElement("div");
    dice.className = "dice";

    CONFIG.diceFaceNames.forEach((faceName) => {
      const face = document.createElement("div");
      face.className = `face ${faceName}`;
      dice.appendChild(face);
    });

    DOM.diceContainer.appendChild(dice);
  }
};

const rollDice = () => {
  let total = 0;
  const diceList = DOM.diceContainer.querySelectorAll(".dice");

  diceList.forEach((dice) => {
    const value = Math.floor(Math.random() * 6) + 1;
    total += value;

    const randomSpin = `rotateX(${Math.random() * 1440}deg) rotateY(${Math.random() * 1440}deg) rotateZ(${Math.random() * 720}deg)`;
    dice.style.transition = `transform ${CONFIG.animation.spinMs}ms linear`;
    dice.style.transform = randomSpin;

    window.setTimeout(() => {
      dice.style.transition = `transform ${CONFIG.animation.settleMs}ms cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
      dice.style.transform = CONFIG.diceRotations[value - 1];
    }, CONFIG.animation.spinMs);
  });

  return total;
};

const getWinner = () => {
  const totalRounds = roundsCount();

  if (state.players[0].wins >= CONFIG.winTarget) {
    return 0;
  }

  if (state.players[1].wins >= CONFIG.winTarget) {
    return 1;
  }

  if (totalRounds >= CONFIG.maxRounds) {
    if (
      state.players[0].wins < CONFIG.winTarget &&
      state.players[1].wins < CONFIG.winTarget
    ) {
      return -1;
    }
    return state.players[0].wins > state.players[1].wins ? 0 : 1;
  }

  return null;
};

const renderGameOver = (winnerIndex) => {
  DOM.diceContainer.style.display = "none";
  DOM.gameInputs.style.display = "none";
  DOM.roundResult.style.display = "none";
  DOM.scoreboardsWrapper.style.display = "none";
  DOM.matchTitle.style.display = "none";
  DOM.container.style.background = "transparent";
  DOM.container.style.boxShadow = "none";

  if (winnerIndex === -1) {
    DOM.turnIndicator.innerHTML = `<p style="font-size: 3rem; margin: 40px 0;">${TEXT.bothLosersLabel}</p>`;
    DOM.turnIndicator.classList.remove("winner-turn");
    showButtons();
    DOM.rollBtn.disabled = true;
    return;
  }

  const winnerPlayer = state.players[winnerIndex];
  DOM.turnIndicator.innerHTML = `<p style="font-size: 3rem; margin: 40px 0;">${TEXT.winnerLabel}<strong>${winnerPlayer.name}</strong></p>`;
  DOM.turnIndicator.classList.add("winner-turn");
  showButtons();
  DOM.rollBtn.disabled = true;
};

const handleRound = (guess, roundTotal) => {
  const activePlayer = currentPlayer();
  const isCorrect = roundTotal === guess;

  activePlayer.lastGuess = String(guess);
  if (isCorrect) {
    activePlayer.wins += 1;
  } else {
    activePlayer.losses += 1;
  }

  showRound({
    playerName: activePlayer.name,
    total: roundTotal,
    isCorrect,
  });

  updateScores();

  const winnerIndex = getWinner();
  if (winnerIndex !== null) {
    renderGameOver(winnerIndex);
    return;
  }

  state.turn = state.turn === 0 ? 1 : 0;
  updateTurn();
  DOM.rollBtn.disabled = false;
};

const rollAllDice = () => {
  const validation = validateGuess(DOM.targetSum.value);
  if (!validation.valid) {
    showError(validation.message);
    return;
  }

  DOM.rollBtn.disabled = true;

  const roundTotal = rollDice();
  window.setTimeout(() => {
    handleRound(validation.guess, roundTotal);
  }, CONFIG.animation.resultMs);
};

const initializeGame = () => {
  const player1Name = DOM.player1NameInput.value.trim();
  const player2Name = DOM.player2NameInput.value.trim();

  if (!player1Name || !player2Name) {
    alert(TEXT.needNames);
    return;
  }

  resetGameData();
  state.players[0].name = player1Name;
  state.players[1].name = player2Name;

  resetScreen();
};

const resetMatch = () => {
  resetGameData();
  resetScreen();
};

const resetGame = () => {
  resetGameData();
  state.players[0].name = CONFIG.defaultPlayerNames[0];
  state.players[1].name = CONFIG.defaultPlayerNames[1];

  resetScreen({
    showNameModal: true,
    clearNameInputs: true,
  });
};

const bindEvents = () => {
  DOM.startGameBtn.addEventListener("click", initializeGame);
  [DOM.player1NameInput, DOM.player2NameInput].forEach((input) => {
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") initializeGame();
    });
  });

  DOM.diceCount.addEventListener("change", () => {
    createDice(Number(DOM.diceCount.value) || CONFIG.defaultDiceCount);
    updateGuessInputBounds();
    DOM.targetSum.value = currentPlayer().lastGuess || "";
  });

  DOM.rollBtn.addEventListener("click", rollAllDice);
  DOM.resetBtn.addEventListener("click", resetMatch);
  DOM.resetGameBtn.addEventListener("click", resetGame);
};

createDice(CONFIG.defaultDiceCount);
updateMatchTitle();
updateGuessInputBounds();
updateTurn();
hideButtons();
clearMessages();
updateScores();
bindEvents();
