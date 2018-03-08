/* eslint eqeqeq: "off", no-unused-expressions: 0, no-plusplus: 0, no-undef: 1, max-len: 0 */
const ticTacToe = {
// ---------------- Tic Tac Toe Game State ----------------
  gameBoard: ['box-0', 'box-1', 'box-2', 'box-3', 'box-4',
    'box-5', 'box-6', 'box-7', 'box-8'],
  gameBoardStatus: [1, 1, 1, 1, 1, 1, 1, 1, 1],

  getS(num) {
    return document.getElementById(this.gameBoard[num]);
  },

  turnStatus: 'player',
  computerLetter: 'x',
  playerLetter: 'o',
  score: { Player: 0, Computer: 0, Ties: 0 },
  boxAnimation: 'flipInX',
  alertAnimation: 'flipInX',

  // ---------------- Set board and Game State Functions ----------------
  hideOrShow(id, show) {
    if (show) {
      document.getElementById(id).classList.add('animated');
      document.getElementById(id).classList.add(this.alertAnimation);
      document.getElementById(id).classList.remove('hide');
    } else {
      document.getElementById(id).classList.add('hide');
      document.getElementById(id).classList.remove('animated');
      document.getElementById(id).classList.remove(this.alertAnimation);
      this.resetBoard();
    }
  },
  chooseXOrO(xO, id) {
    if (xO == 'x') {
      this.playerLetter = 'x';
      this.computerLetter = 'o';
    } else {
      this.playerLetter = 'o';
      this.computerLetter = 'x';
    }
    this.hideOrShow(id);
  },

  setTurn() {
    document.getElementById('turn_Score').innerHTML = `Turn: ${this.turnStatus}`;
  },

  resetBoard() {
    this.gameBoardStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < this.gameBoard.length; i++) {
      this.getS(i).innerHTML = '';
      this.getS(i).classList.remove('animated');
      this.getS(i).classList.remove(this.boxAnimation);
    }
    document.getElementById('player_Score').innerHTML = `Player: ${this.score.Player}`;
    document.getElementById('computer_Score').innerHTML = `Computer: ${this.score.Computer}`;
    document.getElementById('ties_Score').innerHTML = `Ties: ${this.score.Ties}`;

    if (this.turnStatus == 'computer') {
      setTimeout(() => {
        this.computer();
      }, 500);
    }
  },
  masterReset() {
    this.turnStatus = 'player';
    this.resetBoard();
    this.hideOrShow('chooseXO', true);
    this.hideOrShow('xWins');
    this.hideOrShow('oWins');
    this.hideOrShow('tie');
    this.score = { Player: 0, Computer: 0, Ties: 0 };
  },

  // ----------Check Win/Tie Status Functions ----------------
  checkWin(xO) {
    const x = this.gameBoardStatus;
    if (
      (x[0] != 0 && x[0] == x[1] && x[1] == x[2]) ||
      (x[3] != 0 && x[3] == x[4] && x[3] == x[5]) ||
      (x[6] != 0 && x[6] == x[7] && x[6] == x[8]) ||
      (x[0] != 0 && x[0] == x[3] && x[0] == x[6]) ||
      (x[1] != 0 && x[1] == x[4] && x[1] == x[7]) ||
      (x[2] != 0 && x[2] == x[5] && x[2] == x[8]) ||
      (x[0] != 0 && x[0] == x[4] && x[0] == x[8]) ||
      (x[2] != 0 && x[2] == x[4] && x[2] == x[6])

    ) {
      this.gameBoardStatus = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      setTimeout(() => {
        this.hideOrShow(`${xO}Wins`, true);
        if (xO == this.playerLetter) {
          this.score.Player++;
        } else {
          this.score.Computer++;
        }
      }, 200);
      return false;
    }
    return true;
  },
  checkTie() {
    if (!this.gameBoardStatus.includes(0)) {
      setTimeout(() => {
        this.hideOrShow('tie', true);
      }, 200);
      this.score.Ties++;
    }
  },

  // ---------------- Computer Functions ----------------
  computer() {
    const y = this.gameBoardStatus;
    const ply = this.playerLetter;
    const totals = this.getTotals();
    if (this.turnStatus == 'computer') {
      if ((totals[0] <= 1 && totals[1] == 0) || totals[1] == 0) {
        this.round1();
      } else if (y[4] == ply && y[8] == ply && totals[0] <= 2) {
        this.computerMakeXO(2);
      } else if (((y[0] == ply && y[5] == ply) || (y[2] == ply && y[3] == ply))
      && totals[0] <= 2) {
        this.computerMakeXO(7);
      } else if (((y[6] == ply && y[1] == ply))
        && totals[0] <= 2) {
        this.computerMakeXO(5);
      } else if (((y[7] == ply && y[5] == ply))
        && totals[0] <= 2) {
        this.computerMakeXO(8);
      } else if (this.twoInARowCheck() == false) {
        this.oneInARowCheck();
      }
    }
  },
  computerMakeXO(square) {
    this.getS(square).innerHTML = this.computerLetter;
    this.gameBoardStatus[square] = this.computerLetter;
    this.getS(square).classList.add('animated');
    this.getS(square).classList.add(this.boxAnimation);
    this.endComputerRound();
  },
  endComputerRound() {
    if (this.checkWin(this.computerLetter)) {
      this.checkTie();
    }
    this.turnStatus = 'player';
    this.setTurn();
  },
  round1() {
    if (this.gameBoardStatus[4] != this.playerLetter) {
      this.computerMakeXO(4);
    } else {
      this.computerMakeXO(0);
    }
  },
  // gives us the round of the game, player totals is [0] computer totals is [1]
  getTotals() {
    let playerTotalPositions = 0;
    let computerTotalPositions = 0;
    for (let i = 0; i < this.gameBoard.length; i++) {
      if (this.gameBoardStatus[i] == this.playerLetter) {
        playerTotalPositions++;
      } else if (this.gameBoardStatus[i] == this.computerLetter) {
        computerTotalPositions++;
      }
    }
    return [playerTotalPositions, computerTotalPositions];
  },
  twoInARowCheck() {
    // If no computer has two in a row, check if player has 2 in a row
    if (!this.rowCheckFunction(this.computerLetter, this.playerLetter, 2)) {
      this.rowCheckFunction(this.playerLetter, this.computerLetter, 2);
    }

    // Returns true if either the computer has 2 in a row, or player
    if (this.rowCheckFunction(this.computerLetter, this.playerLetter, 2)
      || this.rowCheckFunction(this.playerLetter, this.computerLetter, 2)) {
      return true; // if two in a row is round anywhere, we return true and do not execute oneInARowCheckFunction
    } return false;
  },
  oneInARowCheck() {
    if (!this.rowCheckFunction(this.computerLetter, this.playerLetter, 1)) {
      const first0 = this.gameBoardStatus.indexOf(0);
      // if the computer doesn't have one in a row and
      if (first0 >= 0 && this.turnStatus == 'computer') {
        this.computerMakeXO(first0);
      }
    } return false;
  },
  /* rowCheckFunction Checks if matches with x argument and places on that row.
   call with x and o being computerLetter and playerLetter, and xoPresent being
   if we are checking for 1 or 2 present */
  rowCheckFunction(x, o, xoPresent) {
    const plyr = [];
    const y = this.gameBoardStatus;

    for (let i = 0; i < y.length; i++) {
      if (y[i] == x) {
        plyr.push(1);
      } else {
        plyr.push(0);
      }
    }

    if (plyr[0] + plyr[1] + plyr[2] == xoPresent &&
        ![y[0], y[1], y[2]].includes(o)) {
      this.insertAfterRowCheck([0, y[0]], [1, y[1]], [2, y[2]]);
      return true;
    }
    if (plyr[3] + plyr[4] + plyr[5] == xoPresent &&
        ![y[3], y[4], y[5]].includes(o)) {
      this.insertAfterRowCheck([3, y[3]], [4, y[4]], [5, y[5]]);
      return true;
    }
    if (plyr[6] + plyr[7] + plyr[8] == xoPresent &&
        ![y[6], y[7], y[8]].includes(o)) {
      this.insertAfterRowCheck([6, y[6]], [7, y[7]], [8, y[8]]);
      return true;
    }
    if (plyr[0] + plyr[3] + plyr[6] == xoPresent &&
        ![y[0], y[3], y[6]].includes(o)) {
      this.insertAfterRowCheck([0, y[0]], [3, y[3]], [6, y[6]]);
      return true;
    }
    if (plyr[1] + plyr[4] + plyr[7] == xoPresent &&
        ![y[1], y[4], y[7]].includes(o)) {
      this.insertAfterRowCheck([1, y[1]], [4, y[4]], [7, y[7]]);
      return true;
    }
    if (plyr[2] + plyr[5] + plyr[8] == xoPresent &&
        ![y[2], y[5], y[8]].includes(o)) {
      this.insertAfterRowCheck([2, y[2]], [5, y[5]], [8, y[8]]);
      return true;
    }
    if (plyr[0] + plyr[4] + plyr[8] == xoPresent &&
        ![y[0], y[4], y[8]].includes(o)) {
      this.insertAfterRowCheck([0, y[0]], [4, y[4]], [8, y[8]]);
      return true;
    }
    if (plyr[2] + plyr[4] + plyr[6] == xoPresent &&
        ![y[2], y[4], y[6]].includes(o)) {
      this.insertAfterRowCheck([2, y[2]], [4, y[4]], [6, y[6]]);
      return true;
    }
    return false;
  },

  insertAfterRowCheck(boardIndexAndStatus1, boardIndexAndStatus2, boardIndexAndStatus3) {
    if (boardIndexAndStatus1[1] == 0 && this.turnStatus != 'player') {
      this.computerMakeXO(boardIndexAndStatus1[0]);
    } else if (boardIndexAndStatus2[1] == 0 && this.turnStatus != 'player') {
      this.computerMakeXO(boardIndexAndStatus2[0]);
    } else if (boardIndexAndStatus3[1] == 0 && this.turnStatus != 'player') {
      this.computerMakeXO(boardIndexAndStatus3[0]);
    }
  },


}; // -----------END OF TIC TAC TOE OBJECT ------------


// Adds event listeners to all boxes, registers player turn
for (let i = 0; i < ticTacToe.gameBoard.length; i++) {
  ticTacToe.getS(i).addEventListener('click', () => {
    if (ticTacToe.gameBoardStatus[i] == 0) {
      if (ticTacToe.turnStatus == 'player') {
        // players turn
        ticTacToe.getS(i).classList.add('animated');
        ticTacToe.getS(i).classList.add(ticTacToe.boxAnimation);

        ticTacToe.getS(i).innerHTML = ticTacToe.playerLetter;
        ticTacToe.gameBoardStatus[i] = ticTacToe.playerLetter;

        if (ticTacToe.checkWin(ticTacToe.playerLetter)) {
          ticTacToe.checkTie();
        }
        ticTacToe.turnStatus = 'computer';
        ticTacToe.setTurn();

        // call computer function here
        setTimeout(() => {
          ticTacToe.computer();
        }, 500);
      } /* else { // this can be turned on for 2 player play
        ticTacToe.getS(i).innerHTML = ticTacToe.computerLetter;
        ticTacToe.gameBoardStatus[i] = ticTacToe.computerLetter;
        ticTacToe.getS(i).classList.add('animated');
        ticTacToe.getS(i).classList.add(ticTacToe.boxAnimation);

        ticTacToe.turnStatus = 'player';
        ticTacToe.setTurn();
        if (ticTacToe.checkWin(ticTacToe.computerLetter)) {
          ticTacToe.checkTie();
        }
      } */
    }
  });
}

