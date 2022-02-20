import {answers_array, prompts_array} from "./equations.js"
import { calcDayDiff, updateStatsDiv} from "./stats.js"

function get_answer(){
  var birthday = new Date("2/18/22");
  var today = new Date()
  var index = Math.floor(calcDayDiff(birthday, today))
  return [answers_array[index], prompts_array[index]]
}

function startGame(){
  var answer = get_answer()
  var prompt = document.getElementById("daily-equation")
  var write = answer[1]
  write = write.replace("**2", "<sup>2</sup>");
  prompt.innerHTML = write
  updateStatsDiv()
  return answer
}

export { startGame }