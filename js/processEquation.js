//Input: Entered answer and correct answer
//Return: 
function processAnswer(answer, entered, prompt){
  /*
  The code below will change
  the heading with id = "myH"
  and the paragraph with id = "myP"
  in my web page:
  */
  answer = answer.replace(/\s/g, "");
  entered = entered.replace(/\s/g, "");
  prompt = prompt.replace(/\s/g, "");

  console.log("Got here!")
  var valid = false
  var blues = []
  var greens = []
  var simplified = math.rationalize(answer).toString().replace(/\s/g, "")
  
  if (simplified == prompt.replace(/\s/g, "")){
    valid = true
  }
  if (valid){
    for (i=0; i < answer.length; i++){
      if (answer[i] === entered[i]){
        greens.push(i)
      }
      else if (answer.includes(entered[i])){
        console.log(entered[i])
        blues.push(i)
      }
    }

  }
  var dict = {
      "valid": valid,
      "green": greens,
      "blues": blues,
      "simplified": simplified
    };
  return dict
}
console.log(processAnswer("x*(x + 1) - 1", "x*(1x)", "x^2+x-1"))

//^2 is just ^
//No multiplication before paren
//Check valid math