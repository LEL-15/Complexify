import { processAnswer } from './processEquation.js';
import { endGame, displayStats, closeStats, calcDayDiff, shareSquares, fade } from './stats.js';
import { displaySettings, closeSettings} from './settings.js';
import { displayFeedback, displayError, closeFeedback} from './feedback.js';
import { displayInstructions, closeInstructions, closeInstructionsContinue} from './instructions.js';
import { startGame } from "./start.js"

//Constants
var numTries = 6;
var numGameTiles = 10;
var currentGuess = 0;
var prompt = "";
var answer = "";

export function begin(numGameTilesGiven){
  numGameTiles = numGameTilesGiven
  var start = startGame(numGameTiles)
  prompt = start[1];
  answer = start[0];
  //See if reload is new day
  var boardState = getFromStorage("boardState");
  //First time!
  if (boardState == null){
    console.log("first time")
    boardState = ["", "", "", "", "", ""];
  }
  else{
    console.log("A returner")
    var now  = new Date();
    var lastLoad = getFromStorage("lastLoad");
    lastLoad = new Date(lastLoad);
    //Reset
    if(lastLoad == null || calcDayDiff(lastLoad, now) > 1){
      console.log("It's a new day!")
      boardState = ["", "", "", "", "", ""];
      writeToStorage("", "tile")
      writeToStorage(false, "won")
    }
  }
  lastLoad = now;
  writeToStorage(boardState, "boardState")
  writeToStorage(JSON.stringify(lastLoad), "lastLoad")
  writeToStorage("", "tile")

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
  document.getElementById("toggle_short").addEventListener("click", function(){
    toggleShort();
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
    shareSquares(numGameTiles);
  })
}

// add a square root tile to the game board
export function addSquare(){
  var currentTiles = getFromStorage('tile')
  if (currentTiles.length < numGameTiles){
    let triesCurrent = document.getElementById("tries"+currentGuess);
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + currentTiles.length);
    let square = document.getElementById("square");
    gameTile.innerHTML = square.innerHTML;
    addTileLocalStorage("^");
  }
}

// add a regular number or operation to the game board
export function addTile(tile){
  var currentTiles = getFromStorage('tile')
  if (currentTiles.length < numGameTiles){
    let triesCurrent = document.getElementById("tries"+currentGuess);
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + currentTiles.length);
    gameTile.innerHTML = tile;
    addTileLocalStorage(tile);
  }
}
// add tile value to the localStorage
function addTileLocalStorage(tile){
  var currentTiles = getFromStorage('tile');
  writeToStorage(currentTiles + tile, 'tile')
}
// remove a tile from the game board and from localStorage
export function deleteTile(){
  // as long as localStorage.tile length > 0 remove most recent tile
  // set most recent tile to 0
  var currentTiles = getFromStorage('tile');
  if( currentTiles !== null && currentTiles.length > 0){
    writeToStorage(currentTiles.substring(0, currentTiles.length-1), 'tile')
    let triesCurrent = document.getElementById("tries"+currentGuess);
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + (currentTiles.length-1));
    gameTile.innerHTML = "";
  }
}
// enter the guess for checking
export function enterTiles(){
  // check tiles to be valid equation
  // if valid then change localStorage.tile value to boardState[currentGuess]
  // compare with solution and change tile colors
  var currentTiles = getFromStorage('tile');
  var boardState = getFromStorage("boardState");
  if(currentTiles !== null && currentTiles.length === numGameTiles){
    var dict = processAnswer(answer, currentTiles, prompt);
    // check math
    if (dict["right"]){
      // call win pop up
      setColors(dict["greens"], dict["blues"]);
      boardState[currentGuess] = currentTiles;
      writeToStorage("", 'tile')
      writeToStorage(boardState, 'boardState')
      endGame(true, currentGuess);
    }
    else if (!dict["legal"]){
      displayError();
    }
    else if (!dict["valid"]){
      displayFeedback(prompt, dict["simplified"]);
    }
    else if(dict["legal"] && dict["valid"]){
      // set colors
      setColors(dict["greens"], dict["blues"]);
      // change current Guess
      boardState[currentGuess] = currentTiles;
      writeToStorage("", 'tile')
      writeToStorage(boardState, 'boardState')
      currentGuess += 1;
      if(currentGuess === numTries || currentGuess > numTries){
        endGame(false, currentGuess);
      }
    }
  }
  else{
    //Show popup that text copied
    var popup = document.getElementById("enterPopup");
    popup.classList.toggle("show");
    popup.style.opacity = 1;
    setTimeout(fade, 2000, popup);
  }
}

function setColors(greens, blues){
  let triesCurrent = document.getElementById("tries"+currentGuess);
  for(var i = 0; i<numGameTiles; i++){
    let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + i.toString());
    if(greens.includes(i)){
      gameTile.style.backgroundColor = "lightgreen";
      var character = gameTile.innerHTML
      if (character.length > 1){
        var character_button = document.getElementById("square")
        character_button.style.backgroundColor = "lightgreen"
      }
      else{
        var character_button = document.getElementById(character)
        character_button.style.backgroundColor = "lightgreen"
      }
      
    }
    else if(blues.includes(i)){
      gameTile.style.backgroundColor = "lightblue";
      var character = gameTile.innerHTML
      if (character.length > 1){
        var character_button = document.getElementById("square")
        if (character_button.style.backgroundColor != "lightgreen"){
          character_button.style.backgroundColor = "lightblue"
        }
      }
      else{
        var character_button = document.getElementById(character)
        if (character_button.style.backgroundColor != "lightgreen"){
          character_button.style.backgroundColor = "lightblue"
        }
      }
    }
    else{
      gameTile.style.backgroundColor = "grey";
      var character = gameTile.innerHTML
      if (character.length > 1){
        var character_button = document.getElementById("square")
        character_button.style.backgroundColor = "grey"
      }
      else{
        var character_button = document.getElementById(character)
        character_button.style.backgroundColor = "grey"
      }
    }
  }
}

export function getFromStorage(location){
  if (numGameTiles == 10){
    return JSON.parse(window.localStorage.getItem(location));
  }
  else{
    var game = JSON.parse(window.localStorage.getItem("shortGame"));
    if (game){
      return game[location]
    }
    else{
      return null
    }
  }
}

export function writeToStorage(data, location){
  if (numGameTiles == 10){
    localStorage.setItem(location, JSON.stringify(data));
  }
  else{
    var game = JSON.parse(window.localStorage.getItem("shortGame"));
    if (!game){
      game = {}
    }
    game[location] = data
    localStorage.setItem('shortGame', JSON.stringify(game));
  }
}
function toggleShort(){
  if(numGameTiles == 6){
    window.location.href = './index.html';
  }
  else{
    window.location.href = './short.html';
  }

}