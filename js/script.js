
console.log("It's working!")

var numTries = 6;
var numGameTiles = 10;
// let board = document.getElementsByClassName('board')

for(var i=0; i < numTries; i++){
  let tries = document.createElement('div');
  tries.className = "tries";
  tries.idName = "tries" + i.toString();
  // console.log(tries.idName);
  for(var j=0; j < numGameTiles; j++){
    let gameTiles = document.createElement('div');
    gameTiles.className = "game-tile " + tries.idName;
    gameTiles.idName = tries.idName + "game-tiles" + j.toString();
    // console.log(gameTiles.idName);
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
// function setBoard(){
//
// }
