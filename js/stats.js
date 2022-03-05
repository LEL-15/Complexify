import { displayInstructions, closeInstructions} from './instructions.js';

function calcDayDiff(date1, date2){
  // To calculate the time difference of two dates
  var Difference_In_Time = date2 - date1;
  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return Difference_In_Days
}

function updateStatsDiv(){
  var dict = JSON.parse(window.localStorage.getItem("stats"));
  if (dict == null){
    dict ={}
    dict["currentStreak"] = 0
    dict["bestStreak"] = 0
    dict["history"] = {"win": 0, "loss": 0}
    dict["tries"] = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    dict["gamesPlayed"] = 0
    dict["lastPlay"] = new Date()
    window.localStorage.setItem("stats", JSON.stringify(dict));
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
  var now = new Date()
  if(calcDayDiff(dict["lastPlay"], now) > 1){
    dict["currentStreak"] = 0
  }
  var streak = document.getElementById("current_streak");
  streak.innerHTML = "Current Streak: " + dict["currentStreak"]

  streak = document.getElementById("max_streak");
  streak.innerHTML = "Max Streak: " + dict["currentStreak"]

  //Write the games played data
  var played = document.getElementById("games_played");
  played.innerHTML = "Games Played: " + dict["gamesPlayed"]
}

export function endGame(win, numTries){
  var dict = JSON.parse(window.localStorage.getItem("stats"));
  //Update gamesPlayed
  dict["gamesPlayed"] += 1
  //Update streak records
  dict["currentStreak"] += 1
  if (dict["currentStreak"] > dict["bestStreak"]){
    dict["bestStreak"] = dict["currentStreak"]
  }
  //Update win/loss stats
  if(win){
    dict["history"]["win"] += 1
    if (!("tries" in dict)){
      dict["tries"] = {1: 0, 2: 0, 3: 0, 4:0, 5:0, 6:0}
    }
    dict["tries"][numTries+1] += 1
  }
  else{
    dict["history"]["loss"] += 1
  }
  window.localStorage.setItem("stats", JSON.stringify(dict));
  updateStatsDiv()
  displayStats()
}

export function displayStats(){
  var stats = document.getElementById("stats");
  stats.style.display = "block"
}
export function closeStats(){
  var stats = document.getElementById("stats");
  stats.style.display = "none"
}

updateStatsDiv()

export { calcDayDiff, updateStatsDiv }
