import {answers_array, prompts_array} from "./equations.js"
import { calcDayDiff, updateStatsDiv} from "./stats.js"

function get_answer(){
  var birthday = new Date("2/19/22");
  var today = new Date()
  var index = Math.floor(calcDayDiff(birthday, today))
  console.log(index)
  return [answers_array[index], prompts_array[index]]
}

function startGame(){
  var answer = get_answer()
  var prompt = document.getElementById("daily-equation")
  prompt.innerHTML = answer[1]
  updateStatsDiv()
  return answer
}

console.log(get_answer())

export { startGame }