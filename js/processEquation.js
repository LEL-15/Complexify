import simplify from 'mathjs'

//Input: Entered answer and correct answer
//Return: 
function processAnswer(answer, entered){
  console.log("Got here!")
    console.log(simplify(answer))
    for (char in answer.length){
        print(char)   
    }
    var dict = {
        FirstName: "Chris",
        "one": 1,
        1: "some value"
      };
    return dict
}

processAnswer("x*(x*(x + 1) - 1)", "x*(x*(x + 1) - 1)")