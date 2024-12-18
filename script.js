let games = [];

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

const resetBoard = (() => {
  domVariables.announcer.textContent = `Tic Tac Toe!`;
  domVariables.nameDisplay1.textContent = `Player1`;
  domVariables.nameDisplay2.textContent = `Player2`;
  const list = document.querySelectorAll(".js-choice");
  list.forEach((e) => {
    e.textContent = "1";
  });
})();

async function startNewGame(name1, marker, name2 = "computer") {
  const game = gamePrototype(name1, marker, name2);
  let turn = appLogic.checkStartingTurn(game.player1.marker);
  await appLogic.playGame(
    turn,
    game.table,
    game.winner,
    name2,
    game.player1,
    game.player2
  );
  appLogic.announceWinner(game.winner, game.player1.name, game.player2.name);
  games.push(game);
}

const appLogic = (() => {
  const checkStartingTurn = function (marker) {
    if (marker === "x") {
      return "player1";
    } else return "player2";
  };

  const playGame = async function (turn, table, winner, opponent, p1, p2) {
    while (table.includes(null) && winner[0] === 0) {
      if (turn === "player1") {
        let move = await awaitMove();
        while (table[move] || isNaN(move)) {
          move = await awaitMove();
        }
        updateGame(move, turn, table, p1, p2, winner);
        turn = "player2";
        updateDisplayMsg(turn, p1, p2);
      } else {
        if (opponent === "computer") {
          let move = Math.floor(Math.random() * 9);
          while (table[move]) {
            move = Math.floor(Math.random() * 9);
          }
          updateGame(move, turn, table, p1, p2, winner);
          turn = "player1";
          updateDisplayMsg(turn, p1, p2);
        } else {
          let move = await awaitMove();
          while (table[move] || isNaN(move)) {
            move = await awaitMove();
          }
          updateGame(move, turn, table, p1, p2, winner);
          turn = "player1";
          updateDisplayMsg(turn, p1, p2);
        }
      }
    }
  };

  function awaitMove() {
    return new Promise((resolve) => {
      const gridInput = document.querySelector(".app-container");
      const handleClick = (e) => {
        const moveValue = e.target.getAttribute("data-value");
        if (moveValue !== null) {
          const move = moveValue;
          gridInput.removeEventListener("click", handleClick);
          resolve(move);
        }
      };
      gridInput.addEventListener("click", handleClick);
    });
  }

  function updateGame(move, turn, table, p1, p2, winner) {
    table[move] = turn;
    updateBoard(table, p1, p2);
    checkWinner(table, turn, winner);
  }

  function updateBoard(table, p1, p2) {
    const list = document.querySelectorAll(".js-choice");
    list.forEach((e) => {
      for (let i = 0; i < table.length; i++) {
        if (i === Number(e.getAttribute("data-value"))) {
          if (table[i] === "player1") e.textContent = p1.marker;
          else if (table[i] === "player2") e.textContent = p2.marker;
          else e.textContent = "";
        }
      }
    });
  }

  function updateDisplayMsg(turn, p1, p2) {
    if (turn === "player1")
      domVariables.announcer.textContent = `${p1.name} turn to play`;
    else if (turn === "player2")
      domVariables.announcer.textContent = `${p2.name} turn to play`;
    else e.textContent = "";
  }

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
      domVariables.announcer.textContent = `${winner[0]} has won the game!`;
    } else if (winner[0] === "player2") {
      winner[0] = player2;
      domVariables.announcer.textContent = `${winner[0]} has won the game!`;
    } else domVariables.announcer.textContent = `It is a draw!`;
  };
  return { checkStartingTurn, playGame, announceWinner };
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
