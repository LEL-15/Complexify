export function displayFeedback(prompt, simplified){
  var feedback_popup = document.getElementById("feedback_popup");
  feedback_popup.style.display = "block"
  var str = "Your equation does not simplify to "+ prompt + ". It simplifies to " + simplified + ". Try again";
  var feedback = document.getElementById("feedback");
  feedback.innerHTML = str;
}
export function displayError(){
  var feedback_popup = document.getElementById("feedback_popup");
  feedback_popup.style.display = "block"
  var str = "Your equation is not valid algebra. Try again";
  var feedback = document.getElementById("feedback");
  feedback.innerHTML = str;
}
export function closeFeedback(){
  var feedback_popup = document.getElementById("feedback_popup");
  feedback_popup.style.display = "none"
}
