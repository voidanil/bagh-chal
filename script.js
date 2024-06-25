const board = document.getElementsByClassName("board");
const position = document.getElementsByClassName("position"); //stores the collection of  all 25 positions in the board
const modal = document.getElementById("modal-container");
const navItems = Array.from(document.getElementsByClassName("nav-item"));
const infoDisplaySec = document.querySelector(".info-display");

var turn = 1; //counts turns
var presviousPos = -1; //stores the selected position of pieces
var killGoat = false; //flag to check if goat is killed or not
var killGoatPos; //position of killed goat
var killGoatNo = 0; //number of killed goat
var toalGoatPlaced = 0;
var bingo = false; //flag for end of game
var tigerPositions = [0, 4, 20, 24]; //stores position of tiger pieces
var tigerTrappedCount = 0; //counts the number of tiger trapped
var winningMessage = ""; //winner message displayed
var currNavItem = "scoreboard";

var movesValidate = [
  [1, 5, 6],
  [0, 2, 6],
  [1, 3, 6, 7, 8],
  [2, 4, 8],
  [3, 8, 9],
  [0, 6, 10],
  [0, 1, 2, 5, 7, 10, 11, 12],
  [2, 6, 8, 12],
  [2, 3, 4, 7, 9, 12, 13, 14],
  [4, 8, 14],
  [5, 6, 11, 15, 16],
  [6, 10, 12, 16],
  [6, 7, 8, 11, 13, 16, 17, 18],
  [8, 12, 14, 18],
  [8, 9, 13, 18, 19],
  [10, 16, 20],
  [10, 11, 12, 15, 17, 20, 21, 22],
  [12, 16, 18, 22],
  [12, 13, 14, 17, 19, 22, 23, 24],
  [14, 18, 24],
  [15, 16, 21],
  [16, 20, 22],
  [16, 17, 18, 21, 23],
  [18, 22, 24],
  [18, 19, 23],
]; //check the possible normal moves position

var tigerKillsMovesVal = [
  [2, 10, 12],
  [, 3, 11],
  [0, 4, 10, 12, 14],
  [1, , 13],
  [2, 12, 14],
  [, 7, 15],
  [, , , , 8, , 16, 18],
  [, 5, 9, 17],
  [, , , 6, , 16, 18],
  [, 7, 19],
  [0, 2, 12, 20, 22],
  [1, , 13, 21],
  [0, 2, 4, 10, 14, 20, 22, 24],
  [3, 11, , 23],
  [2, 4, 12, 22, 24],
  [5, 17],
  [, 6, 8, , 18, , ,],
  [7, 15, 19],
  [6, 8, , 16, , , ,],
  [9, 17],
  [10, 12, 22],
  [11, , 23],
  [10, 12, 14, 20, 24],
  [13, 21],
  [12, 14, 22],
]; //check the possible moves for Tiger kill

//locating div for positioning pieces
for (let i = 0; i <= 4; i++) {
  Array.from(board).forEach((bod) => {
    for (let j = 0; j <= 4; j++) {
      const node = document.createElement("div");
      node.classList.add("position");
      node.style.left = -5 + j * 25 + "%";
      node.classList.add("position");
      node.style.top = -5 + i * 25 + "%";
      bod.appendChild(node);
    }
  });
}

//holds the array of div of all positions
var positionArray = Array.from(position);

//positioning tiger at start
function setTiger() {
  for (let i = 0; i <= 3; i++) {
    const img = document.createElement("img");
    img.src = "images/tiger.svg";
    img.classList.add("tiger");
    if (i <= 2) {
      positionArray[5 ** i - 1].appendChild(img);
    } else {
      positionArray[20].appendChild(img);
    }
  }
}

//selecting img according to turn
function imgSelect(img) {
  if (turn % 2 == 1) {
    img.src = "images/goat.svg";
    img.classList.add("goat");
  } else if (turn % 2 == 0) {
    img.src = "images/tiger.svg";
    img.classList.add("tiger");
  }
}

//validate  the selected position for shift
function validateMoves(index) {
  const check = movesValidate[presviousPos].includes(index); //checks if the current  index is in the valid array list
  const killCheck = tigerKillsMovesVal[presviousPos].includes(index);
  if (check || killCheck) {
    if (killCheck && turn % 2 == 0) {
      return tigerKills(index); // check for tiger kill move
    }
    if (check) {
      return true; //check for normal one step move
    }
  } else {
    console.log("Invalid move");
    return false;
  }
}

//checks if the tiger kills a goat or not and set kill position and kill flag
function tigerKills(index) {
  const killedGoatPos =
    movesValidate[presviousPos][
      tigerKillsMovesVal[presviousPos].indexOf(index)
    ];
  if (positionArray[killedGoatPos].hasChildNodes()) {
    const killedGoatCheck =
      positionArray[killedGoatPos].firstChild.classList.contains("goat");
    if (killedGoatCheck) {
      // console.log("Goat killed  at position " + killedGoatPos);
      killGoat = true;
      killGoatPos = killedGoatPos;
      killGoatNo++;
      return true; // goat in kill position
    } else {
      console.log("Invalid move");
      return false; // not a goat in kill position
    }
  } else {
    console.log("Invalid move");
    return false; // no pieces in the kill position so return false
  }
}

//checks bingo or end of game
function bingoCheck() {
  tigerTrappedCheck();
  //winning condition for tiger
  if (killGoatNo == 5) {
    console.log("Tiger won the game.");
    winningMessage = "<h3>Tiger won the game.</h3>";
    bingo = true;
    showModal();
  }
  //winning condition for goat
  if (turn % 2 == 1) {
    if (tigerTrappedCount == 4) {
      console.log("Goat won. All tiger are trapped.");
      winningMessage = "<h3>Goat won. All tiger are trapped.</h3>";
      bingo = true;
      showModal();
    }
  }
}

//tiger trapped condition check
function tigerTrappedCheck() {
  tigerTrappedCount = 0;
  tigerPositions.forEach((tigerPos) => {
    var emptyValidPos = false;
    movesValidate[tigerPos].forEach((pos) => {
      if (!positionArray[pos].hasChildNodes()) {
        emptyValidPos = true;
      }
    });
    tigerKillsMovesVal[tigerPos].forEach((pos) => {
      if (!positionArray[pos].hasChildNodes()) {
        emptyValidPos = true;
      }
    });
    if (!emptyValidPos) {
      tigerTrappedCount++;
    }
  });
  tigerTrappedCount != 0
    ? console.log("Tiger trapped = " + tigerTrappedCount)
    : ""; //just to console trapped tiger count
}

//modal display
function showModal() {
  if ((bingo = true)) {
    var winnerMsg = document.getElementById("winner");
    modal.style.visibility = "visible";
    winnerMsg.innerHTML = winningMessage;
  }
}

//restart game mode
document.getElementById("restart").onclick = () => {
  turn = 1; //counts turns
  presviousPos = -1; //stores the selected position of pieces
  killGoat = false; //flag to check if goat is killed or not
  killGoatNo = 0; //number of killed goat
  toalGoatPlaced = 0;
  bingo = false; //flag for end of game
  tigerPositions = [0, 4, 20, 24]; //stores position of tiger pieces
  tigerTrappedCount = 0; //counts the number of tiger trapped
  winningMessage = ""; //winner message displayed
  modal.style.visibility = "hidden"; //hide modal
  positionArray.forEach((pos) => {
    //removes all pieces from board
    if (pos.hasChildNodes()) {
      pos.removeChild(pos.firstChild);
    }
  });
  setTiger(); //set initial Tiger position
  updateScoreBoard();
};

//update the score-board
const updateScoreBoard = () => {
  const remainingTiger = document.querySelector(".rem-tiger");
  const remainingGoat = document.querySelector(".rem-goat");
  const capturedTiger = document.querySelector(".cap-tiger");
  const capturedGoat = document.querySelector(".cap-goat");
  if (currNavItem === "scoreboard") {
    capturedGoat.innerHTML = killGoatNo;
    capturedTiger.innerHTML = tigerTrappedCount;
    remainingGoat.innerHTML = `${20 - toalGoatPlaced}/20`;
    remainingTiger.innerHTML = `${4 - tigerTrappedCount}/4`;
  }
};

setTiger(); //call to set initial tiger position
//placing pieces on click
function placePieces(pos) {
  pos.addEventListener("click", (e) => {
    const img = document.createElement("img");
    // console.log(turn);

    //moves for goat
    if (turn % 2 == 1 && bingo != true) {
      const index = positionArray.indexOf(pos);
      //for placing  20 goat pieces
      if (!pos.hasChildNodes() && turn <= 40) {
        imgSelect(img);
        pos.appendChild(img);
        bingoCheck();
        turn++;
        toalGoatPlaced++;
      }

      //selecting goat piece for shifting
      if (pos.hasChildNodes() && turn > 40 && turn % 2 == 1) {
        const checkClass = pos.firstChild.classList.contains("goat");
        if (checkClass) {
          //for removing previous selected mark
          if (presviousPos != -1) {
            positionArray[presviousPos].firstChild.classList.remove(
              "selectedPiece"
            );
          }
          presviousPos = index;
          pos.firstChild.classList.add("selectedPiece");
        }
      }

      // shifting  goat after all 20 goat are placed
      if (
        !pos.hasChildNodes() &&
        turn > 40 &&
        turn % 2 == 1 &&
        presviousPos != -1 &&
        validateMoves(index)
      ) {
        imgSelect(img);
        positionArray[presviousPos].removeChild(
          positionArray[presviousPos].firstChild
        );
        pos.appendChild(img);
        presviousPos = -1;
        bingoCheck();
        turn++;
      }
    }

    //moves for tiger
    if (turn % 2 == 0 && bingo != true) {
      const index = positionArray.indexOf(pos);
      //selecting tiger piece for shifting
      if (pos.hasChildNodes()) {
        const checkClass = pos.firstChild.classList.contains("tiger");
        if (checkClass) {
          //for removing previous selected mark
          if (presviousPos != -1) {
            positionArray[presviousPos].firstChild.classList.remove(
              "selectedPiece"
            );
          }
          presviousPos = index;
          pos.firstChild.classList.add("selectedPiece");
        }
      }
      //shifting tiger
      if (!pos.hasChildNodes() && presviousPos != -1 && validateMoves(index)) {
        imgSelect(img);
        positionArray[presviousPos].removeChild(
          positionArray[presviousPos].firstChild
        );
        pos.appendChild(img);
        if (killGoat) {
          positionArray[killGoatPos].removeChild(
            positionArray[killGoatPos].firstChild
          );
          killGoat = false;
          console.log("Goat killed = " + killGoatNo);
        }
        tigerPositions[tigerPositions.indexOf(presviousPos)] = index;
        // console.log(tigerPositions);
        presviousPos = -1;
        bingoCheck();
        turn++;
      }
    }
    updateScoreBoard();
  });
}

//game starts from here which initiates the eventListener throught the game
positionArray.forEach((pos) => {
  placePieces(pos);
});

//handle info-display section
const showInfo = (key) => {
  infoDisplaySec.innerHTML = document.querySelector(
    `template[key=${key}]`
  ).innerHTML;
};

// info-navigation section handler
const handleInfoNavigation = (item, index) => {
  item.addEventListener("click", () => {
    const prevItem = document.querySelector(".nav-item-active");
    prevItem.classList.remove("nav-item-active");
    item.classList.add("nav-item-active");
    currNavItem = item.getAttribute("templateKey");
    showInfo(currNavItem);
    updateScoreBoard();
  });
};

//initializing the info-dispaly section
showInfo(currNavItem);

navItems.forEach(handleInfoNavigation);
