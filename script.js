let games = [];

const proto = function (name1, sign, name2) {
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

function startNewGame(name1, marker, name2 = "computer") {
  const game = proto(name1, marker, name2);
  let turn = checkStartingTurn(game.player1.marker);
  playGame(turn, game.table, game.winner, name2);
  announceWinner(game.winner, game.player1.name, game.player2.name);
  games.push(game);
  console.log(game);
}

function announceWinner(winner, player1, player2) {
  if (winner[0] === "player1") {
    winner[0] = player1;
    console.log(`${winner[0]} has won the game!`);
  } else if (winner[0] === "player2") {
    winner[0] = player2;
    console.log(`${winner[0]} has won the game!`);
  } else console.log("it is a draw");
}

function checkStartingTurn(marker) {
  if (marker === "x") {
    return "player1";
  } else return "player2";
}

function playGame(turn, table, winner, opponent) {
  while (table.includes(null) && winner[0] === 0) {
    if (turn === "player1") {
      let move = prompt("choose from 0 to 8");
      while (table[move] || isNaN(move) || move < 0 || move > 8) {
        move = prompt("choose a valid spot");
      }
      table[move] = turn;
      checkWinner(table, turn, winner);
      turn = "player2";
    } else {
      if (opponent === "computer") {
        let move = Math.floor(Math.random() * 9);
        while (table[move]) {
          move = Math.floor(Math.random() * 9);
        }
        table[move] = turn;
        checkWinner(table, turn, winner);
        turn = "player1";
      } else {
        let move = prompt("choose from 0 to 8");
        while (table[move] || isNaN(move) || move < 0 || move > 8) {
          move = prompt("choose a valid spot");
        }
        table[move] = turn;
        checkWinner(table, turn, winner);
        turn = "player1";
      }
    }
  }
}

function checkWinner(table, player, winner) {
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
}
