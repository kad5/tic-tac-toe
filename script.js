let games = [];

const gamePrototype = function (name1, sign, name2) {
  const player1 = { name: name1, marker: sign };
  const player2 = { name: name2, marker: sign === "O" ? "X" : "O" };
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
  const x = document.getElementById("x");
  const o = document.getElementById("o");
  const player2 = document.getElementById("player2input");
  const confirmInput = document.getElementById("confirmInputBtn");
  const announcer = document.getElementById("onScreenGuide");
  const nameDisplay1 = document.getElementById("player1display");
  const markerDisplay1 = document.getElementById("p1dmarker");
  const nameDisplay2 = document.getElementById("player2display");
  const markerDisplay2 = document.getElementById("p2dmarker");
  const gameMenu = document.getElementById("newGameMenu");
  return {
    chooseMode,
    humanMode,
    computerMode,
    player1,
    x,
    o,
    player2,
    confirmInput,
    announcer,
    nameDisplay1,
    markerDisplay1,
    nameDisplay2,
    markerDisplay2,
    gameMenu,
  };
})();

async function startNewGame(name1, marker, name2 = "computer") {
  domVariables.gameMenu.classList.remove("moblie-menu");
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
  if (game.winner[0] !== 0) {
    games.push(game);
  }
  miniGames.udapateMiniGames();
}

const appLogic = (() => {
  const checkStartingTurn = function (marker) {
    if (marker === "X") {
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
          if (table[i] === "player1") {
            e.textContent = p1.marker;
            if (p1.marker === "X") {
              e.classList.add("choice-x");
            } else e.classList.add("choice-o");
          } else if (table[i] === "player2") {
            e.textContent = p2.marker;
            if (p2.marker === "X") {
              e.classList.add("choice-x");
            } else e.classList.add("choice-o");
          } else e.textContent = "";
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
    } else {
      winner[0] = "draw";
      domVariables.announcer.textContent = `It is a draw!`;
    }
  };

  const resetBoard = function () {
    domVariables.announcer.textContent = `Tic Tac Toe!`;
    domVariables.nameDisplay1.textContent = `Player1`;
    domVariables.markerDisplay1.textContent = " - ";
    domVariables.nameDisplay2.textContent = `Player2`;
    domVariables.markerDisplay2.textContent = " - ";

    document.querySelectorAll(".player-card").forEach((e) => {
      e.classList.remove("choice-x");
      e.classList.remove("choice-o");
    });

    const list = document.querySelectorAll(".js-choice");
    list.forEach((e) => {
      e.textContent = "";
      e.classList.remove("choice-x");
      e.classList.remove("choice-o");
    });
  };

  function assignNamesColors(signChoice) {
    domVariables.nameDisplay1.textContent = domVariables.player1.value;
    domVariables.markerDisplay1.textContent = signChoice;
    domVariables.nameDisplay1.parentElement.classList.add(
      signChoice === "X" ? "choice-x" : "choice-o"
    );
    domVariables.markerDisplay2.textContent = signChoice === "X" ? "O" : "X";
    domVariables.nameDisplay2.parentElement.classList.add(
      signChoice === "X" ? "choice-o" : "choice-x"
    );
  }
  return {
    checkStartingTurn,
    playGame,
    announceWinner,
    resetBoard,
    assignNamesColors,
  };
})();

const eventListeners = (() => {
  let signChoice;
  let gameMode;

  document.getElementById("mobileMenu").addEventListener("click", () => {
    domVariables.gameMenu.classList.toggle("moblie-menu");
  });

  domVariables.chooseMode.addEventListener("click", () => {
    page1Btn.style.display = "none";
    humanBtn.style.display = "initial";
    computerBtn.style.display = "initial";
    appLogic.resetBoard();
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
    signChoice = "X";
    confirmInputBtn.disabled = false;
  });
  domVariables.o.addEventListener("click", () => {
    signChoice = "O";
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
        appLogic.assignNamesColors(signChoice);
        domVariables.nameDisplay2.textContent = domVariables.player2.value;
      }
    } else if (gameMode === "computer") {
      startNewGame(domVariables.player1.value, signChoice);
      appLogic.assignNamesColors(signChoice);
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

const miniGames = (() => {
  function udapateMiniGames() {
    const container = document.querySelector(".all-games");
    container.innerHTML = "";

    let newstfirst = games.slice().reverse();

    newstfirst.forEach((g) => {
      const preview = document.createElement("div");
      preview.classList.add("game-preview");

      const card = document.createElement("div");
      card.classList.add("game-card");

      const miniGame = document.createElement("div");
      miniGame.classList.add("mini-game");

      g.table.forEach((value) => {
        if (value === "player1") {
          const p1div = document.createElement("div");
          p1div.textContent = g.player1.marker;
          p1div.classList.add("mini-choice");
          g.player1.marker === "X"
            ? p1div.classList.add("choice-x")
            : p1div.classList.add("choice-o");
          miniGame.appendChild(p1div);
        }
        if (value === "player2") {
          const p2div = document.createElement("div");
          p2div.textContent = g.player2.marker;
          p2div.classList.add("mini-choice");
          g.player2.marker === "X"
            ? p2div.classList.add("choice-x")
            : p2div.classList.add("choice-o");
          miniGame.appendChild(p2div);
        }
        if (value === null) {
          const ndiv = document.createElement("div");
          ndiv.textContent = "";
          ndiv.classList.add("mini-choice");
          miniGame.appendChild(ndiv);
        }
      });

      const miniP1 = document.createElement("p");
      miniP1.textContent = g.player1.name;
      g.player1.marker === "X"
        ? miniP1.classList.add("choice-x")
        : miniP1.classList.add("choice-o");

      const miniP2 = document.createElement("p");
      miniP2.textContent = g.player2.name;
      if (g.player2.marker === "X") {
        miniP2.classList.add("choice-x");
      } else if (g.player2.marker === "O") {
        miniP2.classList.add("choice-o");
      }

      const minidate = document.createElement("p");
      minidate.textContent = g.gameDate;

      card.appendChild(miniGame);
      card.appendChild(miniP1);
      card.appendChild(miniP2);
      card.appendChild(minidate);
      preview.appendChild(card);
      container.appendChild(preview);
    });
  }
  return { udapateMiniGames };
})();

miniGames.udapateMiniGames();
appLogic.resetBoard();
