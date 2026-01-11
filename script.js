(() => {
  const ANSWER = "CAKE";
  const MAX_ROWS = 6;
  const WORD_LEN = 4;

  const gridEl = document.getElementById("grid");
  const formEl = document.getElementById("guessForm");
  const inputEl = document.getElementById("guessInput");
  const msgEl = document.getElementById("message");
  const hintBtn = document.getElementById("hintBtn");
  const resetBtn = document.getElementById("resetBtn");
  const hintBox = document.getElementById("hintBox");
  const hintText = document.getElementById("hintText");
  const winArea = document.getElementById("winArea");

  let rowIndex = 0;
  let gameOver = false;

  // Build grid
  const tiles = [];
  for (let r = 0; r < MAX_ROWS; r++) {
    const row = document.createElement("div");
    row.className = "row";
    const rowTiles = [];
    for (let c = 0; c < WORD_LEN; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = "";
      row.appendChild(tile);
      rowTiles.push(tile);
    }
    gridEl.appendChild(row);
    tiles.push(rowTiles);
  }

  function setMessage(text) {
    msgEl.textContent = text;
  }

  function normaliseGuess(raw) {
    return (raw || "").trim().toUpperCase();
  }

  // Wordle-like evaluation (handles duplicates properly)
  function evaluateGuess(guess, answer) {
    const result = Array(WORD_LEN).fill("bad");
    const answerArr = answer.split("");
    const guessArr = guess.split("");

    // First pass: greens
    for (let i = 0; i < WORD_LEN; i++) {
      if (guessArr[i] === answerArr[i]) {
        result[i] = "good";
        answerArr[i] = null;
        guessArr[i] = null;
      }
    }

    // Second pass: yellows
    for (let i = 0; i < WORD_LEN; i++) {
      if (guessArr[i] == null) continue;
      const foundAt = answerArr.indexOf(guessArr[i]);
      if (foundAt !== -1) {
        result[i] = "warn";
        answerArr[foundAt] = null;
      }
    }

    return result;
  }

  function paintRow(guess, evaluation) {
    for (let i = 0; i < WORD_LEN; i++) {
      const tile = tiles[rowIndex][i];
      tile.textContent = guess[i];
      tile.classList.remove("good", "warn", "bad");
      tile.classList.add(evaluation[i]);
    }
  }

  function endGameWin() {
    gameOver = true;
    setMessage("POOPP YOU COOKKEDDD");
    winArea.hidden = false;
    inputEl.disabled = true;
    formEl.querySelector("button[type='submit']").disabled = true;
  }

  function endGameLose() {
    gameOver = true;
    setMessage(`Out of tries my baddie bot The word was ${ANSWER}.`);
    inputEl.disabled = true;
    formEl.querySelector("button[type='submit']").disabled = true;
  }

  hintBtn.addEventListener("click", () => {
    hintBox.hidden = false;
    hintText.textContent = "The word is something to do with something that I always make you after we have a blip";
    hintBtn.disabled = true;
    inputEl.focus();
  });

  resetBtn.addEventListener("click", () => {
    // quick reset without reloading page
    rowIndex = 0;
    gameOver = false;
    setMessage("");
    winArea.hidden = true;
    hintBox.hidden = true;
    hintBtn.disabled = false;
    inputEl.disabled = false;
    formEl.querySelector("button[type='submit']").disabled = false;
    inputEl.value = "";
    for (let r = 0; r < MAX_ROWS; r++) {
      for (let c = 0; c < WORD_LEN; c++) {
        tiles[r][c].textContent = "";
        tiles[r][c].classList.remove("good", "warn", "bad");
      }
    }
    inputEl.focus();
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gameOver) return;

    const guess = normaliseGuess(inputEl.value);

    if (guess.length !== WORD_LEN) {
      setMessage("Needs to be 4 letters poop");
      return;
    }

    if (!/^[A-Z]{4}$/.test(guess)) {
      setMessage("Letters only please hottie");
      return;
    }

    const evaluation = evaluateGuess(guess, ANSWER);
    paintRow(guess, evaluation);

    if (guess === ANSWER) {
      endGameWin();
      return;
    }

    rowIndex++;
    inputEl.value = "";

    if (rowIndex >= MAX_ROWS) {
      endGameLose();
      return;
    }

    setMessage("KEEP GOINGG");
    inputEl.focus();
  });

  // Start
  setMessage("SIX TRIES DARLING, YOU GOT THISSS 🤍");
  inputEl.focus();
})();
