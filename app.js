//importing the node module
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

// define routes here..
app.use(bodyParser.urlencoded({extended: false}));
app.use('/image', express.static(__dirname+'/image'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/jquery-3.4.1.min.js', express.static(__dirname + '/jquery-3.4.1.min.js'));

// get request from server
app.get('/', function(req, res){
    res.sendFile('calculator.html',{root: __dirname});
});
app.post('/calculate', function(req, res) {
    var str = req.body.query;
    var tempArr = str.split('÷').join('/');
    var arr = tempArr.split('x').join('*');
    console.log(arr);

    function Stack() {
        this.dataStore = [];
        this.top = 0;
        this.push = function push(element) {
            this.dataStore[this.top++] = element;
        }
        this.pop = function pop() {
            return this.dataStore[--this.top];
        }
        this.peek = function peek() {
            return this.dataStore[this.top-1];
        }
        this.length = function length() {
            return this.top;
        }
        this.toString = function(){
            return this.dataStore.slice(0,this.top-1).toString();
        }
    }

    var infix = arr;
    // remove spaces, so infix[i]!=" "
    infix = infix.replace(/\s+/g, '');
    var oprStack = new Stack();
    var ops = "*/+-";
    var precedence = {"*":3, "/":3, "+":2, "-":2};
    var token="";
    var postfix = "";
    var currentOpr, prevOprInStack;
    var tempToken='';
    for (var i = 0; i < infix.length; i++) {
        token = infix[i];
        //console.log(i+":"+token);
        // if token is operand (here limited to 0 <= x <= 9)
        if((token >= "0" && token <= "9")||token==='.'){
            tempToken=tempToken+token;
            //if next input is operator or end of input array
            if(((ops.indexOf(infix[i+1]) != -1))||(i===infix.length-1)||(infix[i+1]==')')||(infix[i+1]=='(')){
                postfix += tempToken + " ";
                tempToken='';
            }
        }
        // if token is an operator
        else if(ops.indexOf(token) != -1) {
            currentOpr = token;
            prevOprInStack = oprStack.peek();
            if((precedence[currentOpr]<precedence[prevOprInStack])){
            while (oprStack.top!=0){
                postfix += prevOprInStack + " ";
                prevOprInStack = oprStack.pop();
            }
            }
            oprStack.push(token);
        }
        else if (token == '(') {
            oprStack.push(token);
        }
        else if (token == ')') {
            while (oprStack.peek() != '('){
                postfix += oprStack.pop() + ' ';
            }
            oprStack.pop();
        }
        //console.log("Post:"+postfix.toString());
        //console.log("OprStack:"+oprStack.toString());
    }
    // we have converted infix to postfix and stored in 'postfix'.
    while(oprStack.length()>0){
    postfix += oprStack.pop()+' ';
    }
    //console.log(postfix.toString());
    var ms = new MathSolver();
    var result = (ms.SolvePostfix(postfix));
    res.send('' + result);
    function MathSolver() {
    this.SolvePostfix = function(postfix) {
        var resultStack = [];
        //console.log(postfix);
        postfix = postfix.split(" ");
        //console.log(postfix.toString());
        for (var i = 0; i < postfix.length-1; i++) {
            if (!isNaN(parseFloat(postfix[i]))) {
                resultStack.push(postfix[i]);
            }
            else {
                var b = resultStack.pop();
                var a = resultStack.pop();
                if (postfix[i] === "+") {
                    resultStack.push(parseFloat(a) + parseFloat(b));
                }
                else if (postfix[i] === "-") {
                    resultStack.push(parseFloat(a) - parseFloat(b));
                }
                else if (postfix[i] === "/") {
                    console.log("a="+a+" b="+b+" sum="+(parseFloat(a) / parseFloat(b)))
                    resultStack.push(parseFloat(a) / parseFloat(b));
                }
                else if (postfix[i] === "*") {
                    resultStack.push(parseFloat(a) * parseFloat(b));
                }
            }
            console.log(resultStack);
            // end of for loop
        }
        if(resultStack.length > 1) {
            return 'Invalid Input';
        }
        else {
            var rtn=resultStack.pop();
            //console.log(rtn);
            return ((!isNaN(parseFloat(rtn)))?rtn.toString():'Invalid Input');
        }
        // end of postfix method
      }
      // end of mathSolver
    }
    // end of  post method
});

// port details
var server = app.listen(8080, function(){
    console.log('Node server is running..');
});