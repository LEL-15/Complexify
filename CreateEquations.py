from sympy import *
import random
import re

def replacer(s, newstring, index, nofail=False):
    # raise an error if index is outside of the string
    if not nofail and index not in range(len(s)):
        raise ValueError("index outside given string")

    # if not erroring, but the index is still not in the correct range..
    if index < 0:  # add it to the beginning
        return newstring + s
    if index > len(s):  # add it to the end
        return s + newstring

    # insert the new string between "slices" of the original
    return s[:index] + newstring + s[index + len(newstring):]

def insert(s, newstring, index, nofail=False):
    # raise an error if index is outside of the string
    if not nofail and index not in range(len(s)):
        raise ValueError("index outside given string")

    # if not erroring, but the index is still not in the correct range..
    if index < 0:  # add it to the beginning
        return newstring + s
    if index > len(s):  # add it to the end
        return s + newstring

    # insert the new string between "slices" of the original
    return s[:index] + newstring + s[index+1:]

def pickXOrNum():
    pick = random.randint(0, 1)
    if pick == 0:
        return "x"
    else:
        answer = str(random.randint(1, 9))
        return answer

def pickOperation():
    pick = random.randint(0, 4)
    if pick == 0:
        return "*"
    elif pick == 1:
        return "/"
    elif pick == 2:
        return "+"
    elif pick == 3:
        return "-"
    elif pick == 4:
        return "^"

def pickNumOrOp():
    pick = random.randint(0, 3)
    if pick == 0:
        return pickOperation()
    else:
        return pickXOrNum()

def fillNoParen(length, start, end_op=False):
    filled = " " * (length)
    #First thing in paren can't be operation
    char_or_operation = start
    char_loc = 0
    while char_loc < length:
        char = ""
        if char_or_operation == pick_char:
            char = pickXOrNum()
        elif char_or_operation == pick_char_or_operation:
            char = pickNumOrOp()
        elif char_or_operation == pick_operation:
            char = pickOperation()
        else:
            print("Well, that's bad")
        filled = replacer(filled, char, char_loc)
        #If we just wrote an operation, next must be x or num
        if char in "*/+-":
            char_or_operation = pick_char
        elif char == "^":
            #If equation can't end in operation, second to last can't be ^
            if char_loc == length - 2 and end_op == False:
                char_loc -= 1
            else:
                char_or_operation = pick_operation
        #Let's not divide by 0
        elif char == "0":
            if filled[char_loc-1] == "/":
                char_loc -= 1
        #Can't put another x or num after x
        elif char == "x":
            #If we just wrote an x and the next character is last, sometimes the last has to be ^2
            if char_loc == length-2 and not end_op:
                filled = replacer(filled, "^", char_loc+1)
                break
            else:
                char_or_operation = pick_operation
        #Last chracter sometimes can't be operation
        elif char_loc == length-2 and not end_op:
            char_or_operation = pick_char
        #Otherwise operation away
        else:
            char_or_operation = pick_char_or_operation
        char_loc += 1
    return filled

def prettify(equations):
    remove_exp = []
    for equation in equations:
        remove_exp.append(equation.replace("^", "**2"))
    return remove_exp

def prepareForSimplify(equations):
    answer = []
    for equation in equations:
        flag = true
        while(flag):
            for char in range(len(equation)):
                if equation[char] == "(" or equation[char] == "x":
                    if char != 0 and equation[char-1] in "1234567890x":
                        equation = equation[:char]+"*"+equation[char:]
                        char+=1
            if char == len(equation)-1:
                flag=false
        answer.append(equation)
    return answer

num_eq = 1000
num_char = 6
pick_char = 0
pick_operation = 1
pick_char_or_operation = 2
paren_odds = 0
#Let's make some equations!
equations = []
for x in range(num_eq):
    #This is our equation
    equation = " " * num_char
    if (random.uniform(0, 1) < paren_odds):
        #Let's start by placing the parens
        open_paren_loc = random.randint(0, num_char-3)
        equation = replacer(equation, "(", open_paren_loc)
        options = list(range(open_paren_loc + 2, num_char-2)) + [num_char-1]
        close_paren_loc = random.choice(options)
        equation = replacer(equation, ")", close_paren_loc)
        #Okay, let's fill in those parens
        in_paren = fillNoParen(close_paren_loc - open_paren_loc -1, start=pick_char)
        equation = replacer(equation, in_paren, open_paren_loc+1)
        #Part before the parens
        before_paren = fillNoParen(open_paren_loc, start=pick_char, end_op=True)
        equation = replacer(equation, before_paren, 0)
        #Part after the parens
        if(num_char-close_paren_loc-1 > 0):
            after_paren = fillNoParen(num_char-close_paren_loc-1, start=pick_operation, end_op=False)
            equation = replacer(equation, after_paren, close_paren_loc+1)
    else:
        equation = fillNoParen(len(equation), start=pick_char, end_op=False)
    equations.append(equation)

write_equations = equations
equations = prettify(equations)
print(equations)
simple_ready = prepareForSimplify(equations)
simplified = []
x = symbols('x')
for equation in simple_ready:
    equation = eval(equation)
    simplified.append(expand(equation))
simplified_good = []
equations_good = []
for equation in range(len(simplified)):
    simple_equation = str(simplified[equation])
    matches = re.finditer("\*\*", simple_equation)
    indices = [match.start() for match in matches]
    good = True
    for index in indices:
        if simple_equation[index+2] != "2":
            good = False
    if "x" not in simple_equation:
        good = False
    if good:
        simplified_good.append(simple_equation)
        equations_good.append(write_equations[equation])

f = open("shortAnswers.txt", "a")
f.write(str(equations_good))
f.close()

f = open("shortSimplified.txt", "a")
f.write(str(simplified_good))
f.close()

print(simplified_good)
print(equations_good)