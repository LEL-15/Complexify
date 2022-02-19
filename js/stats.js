function updateStatsDiv(){
  var dict = JSON.parse(window.localStorage.getItem("stats"));
  if (dict == null){
    dict ={}
    dict["currentStreak"] = 0
    dict["bestStreak"] = 0
    dict["history"] = {"win": 0, "loss": 0}
    dict["gamesPlayed"] = 0
    window.localStorage.setItem("stats", JSON.stringify(dict));
  }
  else{
    console.log("Got the dict!")
  }
  //Write the win percent
  var wins = document.getElementById("win%");
  if(dict["gamesPlayed"] == 0){
    wins.innerHTML = "Win %: -"
  }
  else{
    wins.innerHTML = "Win %: " + (dict["history"]["win"] / (dict["history"]["win"] + dict["history"]["loss"])).toString()
  }
  //Write the streak data
  var streak = document.getElementById("current_streak");
  streak.innerHTML = "Current Streak: " + dict["currentStreak"]
  
  streak = document.getElementById("max_streak");
  streak.innerHTML = "Max Streak: " + dict["currentStreak"]

  //Write the games played data
  var played = document.getElementById("games_played");
  streak.innerHTML = "Games Played: " + dict["gamesPlayed"]
}

function endGame(win){
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
  }
  else{
    dict["history"]["loss"] += 1
  }
  window.localStorage.setItem("stats", JSON.stringify(dict));
}

updateStatsDiv()
endGame(true)