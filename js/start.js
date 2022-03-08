import {answers_array, prompts_array, short_answers_array, short_prompts_array} from "./equations.js"
import { calcDayDiff, updateStatsDiv} from "./stats.js"

function get_answer(numGameTiles){
  var birthday = new Date("2/15/22");
  var today = new Date()
  var index = Math.floor(calcDayDiff(birthday, today))
  if(numGameTiles == 10){
    return [answers_array[index], prompts_array[index]]
  }
  else{
    return [short_answers_array[index], short_prompts_array[index]]
  }
}

function startGame(numGameTiles){
  var answer = get_answer(numGameTiles)
  var prompt = document.getElementById("daily-equation")
  var write = answer[1]
  write = write.replace("**2", "^2");
  write = write.replace("*", "")
  write = MathJax.tex2chtml(write, {em: 12, ex: 6, display: false});
  prompt.appendChild(write);
  updateStatsDiv()
  return answer
}

export { startGame }