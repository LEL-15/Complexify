import { processAnswer } from './processEquation.js';
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
  export function addTileLocalStorage(tile){
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
  export function enterTiles(answer, prompt, currentGuess, numGameTiles){
    // check tiles to be valid equation
    // if valid then change localStorage.tile value to boardState[currentGuess]
    // compare with solution and change tile colors
    var currentTiles = localStorage.getItem('tile');
    if(currentTiles !== null && currentTiles.length === 10){
      var dict = processAnswer(answer, currentTiles, prompt);
      // check math
      if (dict["right"]){
        // call win pop up
        setColors(dict["greens"], dict["blues"], currentGuess, numGameTiles);
        boardState[currentGuess] = currentTiles;
        localStorage.setItem('tile', "");
        localStorage.setItem('boardState', JSON.stringify(boardState));
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
        setColors(dict["greens"], dict["blues"], currentGuess, numGameTiles);
        // change current Guess
        boardState[currentGuess] = currentTiles;
        localStorage.setItem('tile', "");
        localStorage.setItem('boardState', JSON.stringify(boardState));
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
  
  function setColors(greens, blues, currentGuess, numGameTiles){
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
  