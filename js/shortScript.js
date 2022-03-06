import { processAnswer } from './processEquation.js';
import { endGame, displayStats, closeStats, calcDayDiff, shareSquares, fade } from './stats.js';
import { displaySettings, closeSettings} from './settings.js';
import { displayFeedback, displayError, closeFeedback} from './feedback.js';
import { displayInstructions, closeInstructions, closeInstructionsContinue} from './instructions.js';
import { startGame } from "./start.js"
import {  } from "./script.js"


//Constants
var numTries = 6;
var numGameTiles = 6;

//See if reload is new day
console.log("First thing!")
var boardState = JSON.parse(window.localStorage.getItem("boardState"));
console.log(boardState)
//First time!
if (boardState == null){
  console.log("first time")
  boardState = ["", "", "", "", "", ""];
}
else{
  console.log("A returner")
  var now  = new Date();
  var currentGuess = 0;
  var lastLoad = JSON.parse(window.localStorage.getItem("lastLoad"));
  lastLoad = new Date(lastLoad);
  //Reset
  if(lastLoad == null || calcDayDiff(lastLoad, now) > 1){
    console.log("It's a new day!")
    boardState = ["", "", "", "", "", ""];
    localStorage.setItem('tile', "");
    localStorage.setItem('won', JSON.stringify(false));
  }
}
lastLoad = now;
localStorage.setItem('boardState', JSON.stringify(boardState));
localStorage.setItem('lastLoad', JSON.stringify(lastLoad));
localStorage.setItem('tile', "");

var start = startGame()
var prompt = start[1];
var answer = start[0];

// Setup empty board
for(var i=0; i < numTries; i++){
  let tries = document.createElement('div');
  tries.className = "tries";
  tries.id = "tries" + i.toString();
  for(var j=0; j < numGameTiles; j++){
    let gameTiles = document.createElement('div');
    gameTiles.className = "game-tile " + tries.id;
    gameTiles.id = tries.id + "game-tiles" + j.toString();
    gameTiles.innerHTML = "";
    tries.appendChild(gameTiles);
  }
  document.getElementById('game-board').appendChild(tries);
}
//Fill the board if boardState is non-null
if (boardState[0] != ""){
  for(let i=0;i < boardState.length; i+=1){
    let triesCurrent = document.getElementById("tries"+currentGuess);
    if (boardState[i] != ""){
      for(let j = 0; j < boardState[i].length; j+=1){
        let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + j);
        var write = boardState[i][j];
        if (write == "^"){
          write = document.getElementById("square").innerHTML;
        }
        addTileLocalStorage(boardState[i][j]);
        gameTile.innerHTML = write;
      }
      enterTiles();
    }
  }
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

//set up addEventListener
// keyboard entry
document.addEventListener("keydown", function(event){
  var input = event.key;
  if( input >= 0 && input <=9 ){
    addTile(input);
  }
  else if ( input.toString() == "x" || input.toString() == "+" || input.toString() == "-" || input.toString() == "*" || input.toString() == "/" || input.toString() == "(" || input.toString() == ")") {
    addTile(input);
  }  
  else if ( input.toString() == "^" ){
    addSquare();
  }
  else if (input == "Enter"){
    enterTiles();
  }
  else if (input == "Backspace"){
    deleteTile();
  }
})

// awards and stats
document.getElementById("awards").addEventListener("click", function(){
  displayStats();
})
document.getElementById("close_stats").addEventListener("click", function(){
  closeStats();
})
// settings
document.getElementById("settings").addEventListener("click", function(){
  displaySettings();
})
document.getElementById("close_settings").addEventListener("click", function(){
  closeSettings();
})
// feedback
document.getElementById("close_feedback").addEventListener("click", function(){
  closeFeedback();
})
// instructions
document.getElementById("instructions").addEventListener("click", function(){
  displayInstructions();
})
document.getElementById("close_instructions").addEventListener("click", function(){
  closeInstructions();
})
document.getElementById("close_instructions_continue").addEventListener("click", function(){
  closeInstructions();
})
document.getElementById("share").addEventListener("click", function(){
  shareSquares();
})