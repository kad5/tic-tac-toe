let games = [];

function startNewGame(name1, marker, name2 = "computer") {
  const game = gamePrototype(name1, marker, name2);
  let turn = appLogic.checkStartingTurn(game.player1.marker);
  appLogic.playGame(turn, game.table, game.winner, name2);
  appLogic.announceWinner(game.winner, game.player1.name, game.player2.name);
  games.push(game);
  console.log(games);
}

function fetchMove() {
  let recentMove = null;
  const gridInput = document.querySelector(".app-container");
  gridInput.addEventListener("click", (e) => {
    recentMove = e.target.dataset.value;
  });
  if (recentMove) return recentMove;
}

const appLogic = (() => {
  const checkStartingTurn = function (marker) {
    if (marker === "x") {
      return "player1";
    } else return "player2";
  };
  const playGame = function (turn, table, winner, opponent) {
    while (table.includes(null) && winner[0] === 0) {
      if (turn === "player1") {
        let move = prompt("choose from 0 to 8");
        while (table[move] || isNaN(move) || move < 0 || move > 8) {
          move = prompt("choose a valid spot");
        }
        table[move] = turn;
        appLogic.checkWinner(table, turn, winner);
        turn = "player2";
      } else {
        if (opponent === "computer") {
          let move = Math.floor(Math.random() * 9);
          while (table[move]) {
            move = Math.floor(Math.random() * 9);
          }
          table[move] = turn;
          appLogic.checkWinner(table, turn, winner);
          turn = "player1";
        } else {
          let move = prompt("choose from 0 to 8");
          while (table[move] || isNaN(move) || move < 0 || move > 8) {
            move = prompt("choose a valid spot");
          }
          table[move] = turn;
          appLogic.checkWinner(table, turn, winner);
          turn = "player1";
        }
      }
    }
  };
  const checkWinner = function (table, player, winner) {
    if (
      (table[0] === table[1] && table[1] === table[2] && table[2] === player) ||
      (table[3] === table[4] && table[4] === table[5] && table[5] === player) ||
      (table[6] === table[7] && table[7] === table[8] && table[8] === player) ||
      (table[0] === table[3] && table[3] === table[6] && table[6] === player) ||
      (table[1] === table[4] && table[4] === table[7] && table[7] === player) ||
      (table[2] === table[5] && table[5] === table[8] && table[8] === player) ||
      (table[0] === table[4] && table[4] === table[8] && table[8] === player) ||
      (table[2] === table[4] && table[4] === table[6] && table[6] === player)
    ) {
      return (winner[0] = player);
    }
  };
  const announceWinner = function (winner, player1, player2) {
    if (winner[0] === "player1") {
      winner[0] = player1;
      console.log(`${winner[0]} has won the game!`);
    } else if (winner[0] === "player2") {
      winner[0] = player2;
      console.log(`${winner[0]} has won the game!`);
    } else console.log("it is a draw");
  };
  return { checkStartingTurn, playGame, checkWinner, announceWinner };
})();

const gamePrototype = function (name1, sign, name2) {
  const player1 = { name: name1, marker: sign };
  const player2 = { name: name2, marker: sign === "o" ? "x" : "o" };
  const table = [null, null, null, null, null, null, null, null, null];
  let winner = [0];
  const gameDate = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return { player1, player2, table, winner, gameDate };
};

const domVariables = (() => {
  const chooseMode = document.getElementById("page1Btn");
  const humanMode = document.getElementById("humanBtn");
  const computerMode = document.getElementById("computerBtn");
  const player1 = document.getElementById("player1input");
  const signsDisplay = document.getElementById("signsChoice");
  const x = document.getElementById("x");
  const o = document.getElementById("o");
  const player2 = document.getElementById("player2input");
  const confirmInput = document.getElementById("confirmInputBtn");
  const announcer = document.getElementById("onScreenGuide");
  const nameDisplay1 = document.getElementById("player1display");
  const nameDisplay2 = document.getElementById("player2display");
  return {
    chooseMode,
    humanMode,
    computerMode,
    player1,
    signsDisplay,
    x,
    o,
    player2,
    confirmInput,
    announcer,
    nameDisplay1,
    nameDisplay2,
  };
})();

const eventListeners = (() => {
  let signChoice;
  let gameMode;
  domVariables.chooseMode.addEventListener("click", () => {
    page1Btn.style.display = "none";
    humanBtn.style.display = "initial";
    computerBtn.style.display = "initial";
  });

  domVariables.humanMode.addEventListener("click", () => {
    humanBtn.style.display = "none";
    computerBtn.style.display = "none";
    player1input.style.display = "initial";
    signsChoice.style.display = "initial";
    player2input.style.display = "initial";
    confirmInputBtn.style.display = "initial";
    confirmInputBtn.disabled = true;
    gameMode = "human";
  });

  domVariables.computerMode.addEventListener("click", () => {
    humanBtn.style.display = "none";
    computerBtn.style.display = "none";
    player1input.style.display = "initial";
    signsChoice.style.display = "initial";
    confirmInputBtn.style.display = "initial";
    confirmInputBtn.disabled = true;
    gameMode = "computer";
  });

  domVariables.x.addEventListener("click", () => {
    signChoice = "x";
    confirmInputBtn.disabled = false;
  });
  domVariables.o.addEventListener("click", () => {
    signChoice = "o";
    confirmInputBtn.disabled = false;
  });

  domVariables.confirmInput.addEventListener("click", () => {
    if (domVariables.player1.value === "") {
      domVariables.announcer.textContent =
        "Please enter a valid name for player 1";
      return;
    }
    if (gameMode === "human") {
      if (domVariables.player2.value === "") {
        domVariables.announcer.textContent =
          "Please enter a valid name for player 2";
        return;
      } else {
        startNewGame(
          domVariables.player1.value,
          signChoice,
          domVariables.player2.value
        );
        domVariables.nameDisplay1.textContent = domVariables.player1.value;
        domVariables.nameDisplay2.textContent = domVariables.player2.value;
      }
    } else if (gameMode === "computer") {
      startNewGame(domVariables.player1.value, signChoice);
      domVariables.nameDisplay1.textContent = domVariables.player1.value;
      domVariables.nameDisplay2.textContent = "computer";
    }

    domVariables.player1.value = "";
    domVariables.player2.value = "";
    signChoice = "";
    gameMode = "";

    page1Btn.style.display = "initial";
    humanBtn.style.display = "none";
    computerBtn.style.display = "none";
    player1input.style.display = "none";
    signsChoice.style.display = "none";
    player2input.style.display = "none";
    confirmInputBtn.style.display = "none";
  });
})();
