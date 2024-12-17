/* logic
  1. intialize game:
   create a new object 
    all games: containing player 1 name, player1 marker player 2 name, player 2marker an array (table), winner value, date value.
    the array should have 9 indexes each for a possible move.
      > the array is intialized to null values
      > each array value is adjusted to player value

  2. choose marker: x or o. if player chooses x then they go first, if O then computer goes 1st
      > set a player marker according to choice.
      > sets the computer to the other
      > make a variable called turn which flips betwee x and o and itialize it to o
      > o can only play if last turn is x;
      x can play if last turn is o;
  3. after each computer or player move, a check for a winner happens, if no win then the other player plays
      > a check winner function runs with the player marker as an argument.
      > checks if combos are equal to the player marker.
  4. if a winner check returns ture, game ends and the winner value is set to winner name
      > take the recent player as an argument, and if any of the checks returns true then:
          set that player to be a winner;
          keep all other array values as 0;
          intiate close game;
          save the object data;
  5. if the array is completely full, and the winner check returns false, then it is a tie
  
*/
let games = [];

const proto = function (name, marker) {
  const playerName = name;
  const playerMarker = marker;
  const computerMarker = marker === "o" ? "x" : "o";
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
  return { playerName, playerMarker, computerMarker, table, winner, gameDate };
};

function intializeGame(name, marker) {
  const game = proto(name, marker);
  let turn = checkStartingTurn(game.playerMarker);
  playGame(turn, game.table, game.winner);
  console.log(game);
}

function playGame(turn, table, winner) {
  while (table.includes(null) && winner[0] === 0) {
    if (turn === "player") {
      let move = prompt("choose from 0 to 8");
      while (table[move] || isNaN(move) || move < 0 || move > 8) {
        move = prompt("choose a valid spot");
      }
      table[move] = turn;
      checkWinner(table, turn, winner);
      turn = "computer";
    } else {
      let move = Math.floor(Math.random() * 9);
      while (table[move]) {
        move = Math.floor(Math.random() * 9);
      }
      table[move] = turn;
      checkWinner(table, turn, winner);
      turn = "player";
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
    console.log(`${player} wins`);
    return (winner[0] = player);
  }
}

function checkStartingTurn(marker) {
  if (marker === "x") {
    return "player";
  } else return "computer";
}
