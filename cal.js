console.log("JS loaded");

//clears the input and output screen on click of C
function clr(){
	calculator.display.value = '';
	calculator.display1.value = '';
}

var tempVal='';
var tempOpr='+-*x÷/';
var oprCount=0;
var tempResultDisplay=0;
var decimalFlag=0;
var previousInput;
var firstInputFlag=0;
//displayValue function: shows the input to display
function displayValue(val){
	tempVal=val;
	if(calculator.display1.value&&(!isNaN(parseFloat(val)))){
		clr();
	}
	else if((calculator.display1.value)&&(isNaN(parseFloat(val)))){
		tempResultDisplay=calculator.display1.value;
		clr();
		Number.isInteger(tempResultDisplay)?decimalFlag=0:decimalFlag=1;
		calculator.display.value+=tempResultDisplay;
	}
	if(tempVal=='('||tempVal==')'||tempOpr.includes(tempVal)){
		decimalFlag=0;
	}
   	if(!isNaN(parseFloat(val))||tempVal=='('||tempVal==')'){
		if((tempVal==='(')&&(!isNaN(parseFloat(previousInput)))){
			calculator.display.value+=' x ';
		}
		calculator.display.value += val;
		oprCount=0;
   	}
	else if((tempOpr.includes(tempVal))&&(oprCount===0)&&firstInputFlag==1){
		calculator.display.value += " "+val+" ";
		oprCount=1;
	}
	else if(tempVal==='.'&&decimalFlag!=1){
		calculator.display.value+='.';
		decimalFlag=1;
	}
	else{
		calculator.display.value;
	}
	previousInput=tempVal;
	firstInputFlag=1;
}

var resultCall = function(){
	$.ajax("http://gauravsingh:8080/calculate",{
		type:'post',
		header:{
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data:{
			query:$("input[name='display']").val()
		},
		success:function(data){
			console.log(data);
			$("input[name='display1']").val(data) ;		// displays logic/result
		},
		error: function(data){
			$("input[name='display1']").val("Invalid"); 	//displays server error
		}
	});
}

function keyPressToDisplay(event){
	var pressedKey=event.which;
	switch(pressedKey){
		case 49: displayValue('1');
				break;
		case 50: displayValue('2');
				break;
		case 51: displayValue('3');
				break;
		case 52: displayValue('4');
				break;
		case 53: displayValue('5');
				break;
		case 54: displayValue('6');
				break;
		case 55: displayValue('7');
				break;
		case 56: displayValue('8');
				break;
		case 57: displayValue('9');
				break;
		case 48: displayValue('0');
				break;
		case 43: displayValue('+');
				break;
		case 45: displayValue('-');
				break;
		case 47: displayValue('/');
				break;
		case 42: displayValue('x');
				break;
		case 40: displayValue('(');
				break;
		case 41: displayValue(')');
				break;
		case 61: resultCall();
				break;
		case 46: displayValue('.');
				break;
	}
}

// ajax call to back-end
$(document).ready(function(){
	$('body').keypress(function(event){
		event.preventDefault();
		keyPressToDisplay(event);
	});
	$('#button2').click( function(){
		resultCall();
	});
});