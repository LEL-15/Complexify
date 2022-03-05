export function displayFeedback(prompt, simplified){
  //Clear out the feedback from last time
  var user_simplified = document.getElementById("feedback_user_simplified");
  while (user_simplified.firstChild) {
    user_simplified.removeChild(user_simplified.firstChild);
  }
  var prompt_simplified = document.getElementById("feedback_prompt_simplified")
  while (prompt_simplified.firstChild) {
    prompt_simplified.removeChild(prompt_simplified.firstChild);
  }
  //Parse what to write
  var prompt_write = prompt.replace("**2", "^2");
  prompt_write = prompt_write.replace("*", "");
  prompt_write = MathJax.tex2chtml(prompt_write, {em: 12, ex: 6, display: false});
  simplified = simplified.replace("*", "");
  var simplified_write = MathJax.tex2chtml(simplified, {em: 12, ex: 6, display: false});
  //Write the equations
  user_simplified.appendChild(simplified_write);
  prompt_simplified.appendChild(prompt_write);
  //Show the popup
  var feedback_popup = document.getElementById("feedback_popup");
  feedback_popup.style.display = "block"
  //Things to fix mathjax
  MathJax.startup.document.clear();
  MathJax.startup.document.updateDocument();
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
