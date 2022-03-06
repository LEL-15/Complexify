import { displayInstructions, closeInstructions} from './instructions.js';
import { writeToStorage, getFromStorage } from './script.js'

function calcDayDiff(date1, date2){
  // To calculate the time difference of two dates
  date1 = date1.setHours(0, 0, 0);
  date2 = date2.setHours(0, 0, 0);
  var Difference_In_Time = Math.abs(date1 - date2);
  console.log(Difference_In_Time)
  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  console.log(Difference_In_Days)
  return Difference_In_Days
}

function updateStatsDiv(){
  var dict = getFromStorage('stats')
  if (dict == null){
    dict ={}
    dict["currentStreak"] = 0
    dict["bestStreak"] = 0
    dict["history"] = {"win": 0, "loss": 0}
    dict["tries"] = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    dict["gamesPlayed"] = 0
    dict["lastPlay"] = new Date()
    writeToStorage(dict, "stats");
    displayInstructions();
  }
  //Write the win percent
  var wins = document.getElementById("win%");
  if(dict["gamesPlayed"] == 0){
    wins.innerHTML = "Win %: -"
  }
  else{
    wins.innerHTML = "Win %: " + ((dict["history"]["win"] / (dict["history"]["win"] + dict["history"]["loss"])) * 100 ).toString()
  }
  //Write the streak data
  var streak = document.getElementById("current_streak");
  streak.innerHTML = "Current Streak: " + dict["currentStreak"]

  streak = document.getElementById("max_streak");
  streak.innerHTML = "Max Streak: " + dict["currentStreak"]

  //Write the games played data
  var played = document.getElementById("games_played");
  played.innerHTML = "Games Played: " + dict["gamesPlayed"]

  //Create the graph
  displayGraph(dict);
}

export function endGame(win, numTries){
  var won = getFromStorage('won');
  if( won == null || won == false){
    var dict = getFromStorage('stats')
    //Update gamesPlayed
    dict["gamesPlayed"] += 1
    //Update streak records
    var now = new Date();
    console.log("We about to do something exciting!")
    console.log(now)
    var compare = new Date(dict['lastPlay'])
    console.log(compare)
    console.log(calcDayDiff(compare, now))
    if(calcDayDiff(compare, now) > 1){
      dict["currentStreak"] = 0
    }
    dict['lastPlay'] = now;
    dict["currentStreak"] += 1
    if (dict["currentStreak"] > dict["bestStreak"]){
      dict["bestStreak"] = dict["currentStreak"]
    }
    //Update win/loss stats
    if(win){
      dict["history"]["win"] += 1;
      if (!("tries" in dict)){
        console.log("adding tries")
        dict["tries"] = {1: 0, 2: 0, 3: 0, 4:0, 5:0, 6:0};
      }
      dict["tries"][numTries+1] += 1;
    }
    else{
      dict["history"]["loss"] += 1;
    }
    writeToStorage(dict, 'stats')
    updateStatsDiv();
    displayStats();
    writeToStorage(true, 'won')
  }
}

export function displayStats(){
  var stats = document.getElementById("stats");
  stats.style.display = "block"
}
export function closeStats(){
  var stats = document.getElementById("stats");
  stats.style.display = "none"
}

function displayGraph(stats){
  if (!("tries" in stats)){
    console.log("adding tries")
    stats["tries"] = {1: 0, 2: 0, 3: 0, 4:0, 5:0, 6:0};
  }
  var xValues = Object.keys(stats['tries']);
  var yValues = Object.values(stats['tries']);
  var barColors = new Array(Object.keys(stats['tries']).length).fill("lightgreen");
  console.log(barColors);
  
  new Chart("statsChart", {
    type: "horizontalBar",
    data: {
      labels: xValues,
      scaleLineColor: 'transparent',
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
        text: "Number of Guesses History"
      },
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
              callback: function(value, index, values) {
                  return '';
              },
          },
          gridLines: {
              display: false,
              drawBorder: false,
          },
        }],
      },
    }
  });
}

function shareSquares(numGameTiles){
  var boardState = getFromStorage('boardState')
  if (boardState[0] != ""){
    var copy = "Complexify "
    if (numGameTiles==6){
      copy += "Short "
    }
    var date = new Date();
    var month = date.toLocaleString('default', { month: 'long' });
    date = month + " " + date.getDate() + ", " + date.getFullYear() + '\n'
    copy += date
    for(let i=0;i < boardState.length; i+=1){
      let triesCurrent = document.getElementById("tries"+i);
      if (boardState[i] != ""){
        for(let j = 0; j < boardState[i].length; j+=1){
          let gameTile = document.getElementById(triesCurrent.id + "game-tiles" + j);
          if (gameTile.style.backgroundColor == "lightgreen"){
            copy += "🟩"
          }
          else if(gameTile.style.backgroundColor == "lightblue"){
            copy += "🟦"
          }
          else{
            copy += "⬜"
          }
        }
        copy += "\n"
      }
    }
  }
  console.log(copy)
  navigator.clipboard.writeText(copy);
  //Show popup that text copied
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
  popup.style.opacity = 1;
  setTimeout(fade, 1000, popup);
}
function fade(fadeTarget){
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
        fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
        fadeTarget.style.opacity -= 0.1;
    }
    else {
        clearInterval(fadeEffect);
        fadeTarget.classList.toggle("show");
    }
  }, 100)
}

export { calcDayDiff, updateStatsDiv, shareSquares, fade}
