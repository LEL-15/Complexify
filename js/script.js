
console.log("It's working!")

// class KeyboardValues {
//
//   static zero = new KeyboardValues('0');
//   static one = new KeyboardValues('1');
//   static two = new KeyboardValues('2');
//   static three = new KeyboardValues('3');
//   static four = new KeyboardValues('4');
//   static five = new KeyboardValues('5');
//   static six = new KeyboardValues('6');
//   static seven = new KeyboardValues('7');
//   static eight = new KeyboardValues('8');
//   static nine = new KeyboardValues('9');
//
//
//   static Plus = new KeyboardValues('+');
//   static Minus = new KeyboardValues('-');
//   static Multiply = new KeyboardValues('*');
//   static Divide = new KeyboardValues('/');
//   static Plus = new KeyboardValues('+');
//   static Minus = new KeyboardValues('-');
//   static Multiply = new KeyboardValues('*');
//   static Divide = new KeyboardValues('/');
//
//   static square = new KeyboardValues('^');
//
//   static enter = new KeyboardValues('enter');
//   static back = new KeyboardValues('back');
//
//
//   constructor(name) {
//     this.name = name;
//   }
//   // toString() {
//   //   return `Color.${this.name}`;
//   // }
// }

var boardState = ["", "", "", "", "", ""];
var currentGuess = 0;
var numTries = 6;
var numGameTiles = 10;
// let board = document.getElementsByClassName('board')

// Setup environment
localStorage.setItem('tile', "");
localStorage.setItem('boardState', boardState);
for(var i=0; i < numTries; i++){
  let tries = document.createElement('div');
  tries.className = "tries";
  tries.id = "tries" + i.toString();
  // console.log(tries.id);
  for(var j=0; j < numGameTiles; j++){
    let gameTiles = document.createElement('div');
    gameTiles.className = "game-tile " + tries.id;
    gameTiles.id = tries.id + "game-tiles" + j.toString();
    // console.log(gameTiles.id);
    gameTiles.innerHTML = "";
    tries.appendChild(gameTiles);
  }
  document.getElementById('game-board').appendChild(tries);
}

// tries1 = document.getElementById("tries1");
// tries1gameTiles = document.getElementsByClassName("tries1");
// for(var i=0; i < tries1gameTiles.length; i++){
//   tries1gameTiles[i].className = tries1gameTiles[i].className + "colorBlue";
//   console.log("Color changed")
// }

// let keyboard = document.getElementsByClassName('keyboard-tile')
//
// for(var i=0; keyboard.length > i; i++){
//   keyboard[i].addEventListener("click", function(){
//     let mode = this.dataset.mode
//     console.log("Option Clicked: ", mode)
//     setTheme(mode)
//   })
// }

function addSquare(){
  let triesCurrent = document.getElementById("tries"+currentGuess);
  let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + localStorage.getItem('tile').length);
  let square = document.getElementById("square");
  gameTile.innerHTML = square.innerHTML;

  addTileLocalStorage("^");
}
function addTile(tile){
  let triesCurrent = document.getElementById("tries"+currentGuess);
  console.log(triesCurrent.id);
  let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + localStorage.getItem('tile').length);
  gameTile.innerHTML = tile;

  addTileLocalStorage(tile);
}
function addTileLocalStorage(tile){
  console.log("Option Clicked: ", tile);
  currentTiles = localStorage.getItem('tile');
  if (currentTiles === null){
    localStorage.setItem('tile', tile);
  }
  else if (currentTiles.length < 10) {
    localStorage.setItem('tile', currentTiles + tile);
  }
}
function deleteTile(){
  // as long as localStorage.tile length > 0 remove most recent tile
  // set most recent tile to 0
  currentTiles = localStorage.getItem('tile');
  if( currentTiles !== null && currentTiles.length > 0){
    localStorage.setItem('tile', currentTiles.substring(0, currentTiles.length-1));
  }
}
function enterTiles(){
  // check tiles to be valid equation
  // if valid then change localStorage.tile value to boardState[currentGuess]
  // compare with solution and change tile colors
  currentTiles = localStorage.getItem('tile');
  if( currentTiles !== null && currentTiles.length === 10){
    boardState[currentGuess] = currentTiles;
    localStorage.setItem('tile', "");
    localStorage.setItem("boardState", boardState);
    currentGuess += 1;
  }


}
