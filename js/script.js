import { processAnswer } from './processEquation.js';

console.log("It's working!")

var boardState = ["", "", "", "", "", ""];
var currentGuess = 0;
var numTries = 6;
var numGameTiles = 10;
var numKeyboard = 20;
var prompt = "x^+5x-2";
var answer = "(x+2)^+x-6";

// Setup environment
// clear localStorage
localStorage.setItem('tile', "");
localStorage.setItem('boardState', boardState);
// Setup empty board
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

var fullKeyboard = document.getElementsByClassName("keyboard-tile");
for(var i=0; i < fullKeyboard.length; i++ ){
  if(fullKeyboard[i].id === "square"){
    fullKeyboard[i].addEventListener("click", function(){
      addSquare();
    })
  }
  else if(fullKeyboard[i].id === "enter"){
    fullKeyboard[i].addEventListener("click", function(){
      enterTiles();
    })
  }
  else if(fullKeyboard[i].id === "delete"){
    fullKeyboard[i].addEventListener("click", function(){
      deleteTile();
    })
  }
  else{
    fullKeyboard[i].addEventListener("click", function(){
      let mode = this.dataset.mode;
      addTile(mode);
    })
  }

}

// add a square root tile to the game board
export function addSquare(){
  var currentTiles = localStorage.getItem('tile');
  if (currentTiles.length < 10){
    let triesCurrent = document.getElementById("tries"+currentGuess);
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + localStorage.getItem('tile').length);
    let square = document.getElementById("square");
    gameTile.innerHTML = square.innerHTML;
    addTileLocalStorage("^");
  }
}
// add a regular number or operation to the game board
export function addTile(tile){
  var currentTiles = localStorage.getItem('tile');
  if (currentTiles.length < 10){
    let triesCurrent = document.getElementById("tries"+currentGuess);
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + localStorage.getItem('tile').length);
    gameTile.innerHTML = tile;
    addTileLocalStorage(tile);
  }
}
// add tile value to the localStorage
function addTileLocalStorage(tile){
  console.log("Option Clicked: ", tile);
  var currentTiles = localStorage.getItem('tile');
  if (currentTiles === null){
    localStorage.setItem('tile', tile);
  }
  else {
    localStorage.setItem('tile', currentTiles + tile);
  }
}
// remove a tile from the game board and from localStorage
export function deleteTile(){
  // as long as localStorage.tile length > 0 remove most recent tile
  // set most recent tile to 0
  var currentTiles = localStorage.getItem('tile');
  if( currentTiles !== null && currentTiles.length > 0){
    localStorage.setItem('tile', currentTiles.substring(0, currentTiles.length-1));
    let triesCurrent = document.getElementById("tries"+currentGuess);
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + localStorage.getItem('tile').length);
    gameTile.innerHTML = "";
  }
}
// enter the guess for checking
export function enterTiles(){
  // check tiles to be valid equation
  // if valid then change localStorage.tile value to boardState[currentGuess]
  // compare with solution and change tile colors
  var currentTiles = localStorage.getItem('tile');
  // var dict = {
  //     "valid": false, // valid, // boolean matches simplified prompt
  //     "green": [1,2,3,4] // greens,  // arr of indexs [0,1,2]
  //     "blues": [5,6,7,8] // blues, // arr of indexs [3,4,5]
  //     // [0,9] indexes excluded from blue and green should be grey
  //     "simplified": "4x+85" //simplified, // if valid false then equation simplifies to this
  //     "right": right, // boolean true if a win!
  //     "legal": legal // boolean true if a valid math equation
  //   };

  if(currentTiles !== null && currentTiles.length === 10){
    var dict = processAnswer(answer, currentTiles, prompt);
    localStorage.setItem("stats", JSON.stringify(dict));
    // check math
    if (dict["right"]){
      // call win pop up
      console.log("you win");
      setColors(dict["greens"], dict["blues"]);
    }
    else if (!dict["valid"]){
      console.log("Your equation does not simplify to "+ prompt + ". It simplfies to " + dict["simplified"]);
      console.log("try again");
      // error log?
    }
    else if(dict["legal"] && dict["valid"]){
      // set colors
      console.log("legal and valid");
      setColors(dict["greens"], dict["blues"]);
      // change current Guess
      boardState[currentGuess] = currentTiles;
      localStorage.setItem('tile', "");
      localStorage.setItem("boardState", boardState);
      currentGuess += 1;
    }
    else {
      console.log("try again");
      // error log?
    }

  }
  function setColors(greens, blues){
    let triesCurrent = document.getElementById("tries"+currentGuess);
    for(var i = 0; i<numGameTiles; i++){
      let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + i.toString());
      if(greens.includes(i)){
        gameTile.style.backgroundColor = "lightgreen";
      }
      else if(blues.includes(i)){
        gameTile.style.backgroundColor = "lightblue";
      }
      else{
        gameTile.style.backgroundColor = "grey";
      }
    }
  }
}
