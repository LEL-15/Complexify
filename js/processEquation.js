function insert(base, add, index){
  base = base.slice(0, index) + add + base.slice(index)
  return base
}
function mathClean(expression){
  var legal = true
  //^2 is just ^
  expression = expression.replaceAll('^','^2');
  //No multiplication before paren
  for (i=0; i < expression.length; i++){
    if ((expression[i] === "(" || expression[i] == "x") && i!=0){
      if ("1234567890x".includes(expression[i-1])){
        expression = insert(expression, "*", i)
        i+=1
      }
    }
  }
  //Check valid math
  return [expression, legal]
}

function processAnswer(answer, entered, prompt){
  answer = answer.replace(/\s/g, "");
  entered = entered.replace(/\s/g, "");
  prompt = mathClean(prompt)[0].replace(/\s/g, "");
  var right = false
  var valid = false
  var legal = true
  var blues = []
  var greens = []
  var cleanAnswer = mathClean(answer)
  legal = cleanAnswer[1]
  cleanAnswer = cleanAnswer[0]
  //Only proceed if the equation is legal math
  if(legal){
    var simplified = math.rationalize(cleanAnswer).toString().replace(/\s/g, "")
    if (simplified === prompt){
      valid = true
    }
    //Only proceed if the equation matches the simplified prompt
    if (valid){
      for (i=0; i < answer.length; i++){
        if (answer[i] === entered[i]){
          greens.push(i)
        }
        else if (answer.includes(entered[i])){
          blues.push(i)
        }
      }
    }
  }
  var dict = {
      "valid": valid,
      "green": greens,
      "blues": blues,
      "simplified": simplified,
      "right": right
    };
  return dict
}
console.log(processAnswer("(x+1)^ - 1", "x*(1x)", "x^+2x"))