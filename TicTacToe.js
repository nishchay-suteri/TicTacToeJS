var board=["E","E","E","E","E","E","E","E","E"];
var difficulty="beginner";// for the time being
var prevDiff="beginner";
var turn,result,status="beginning";// status=end,running,beginning
var player="X",computer="O";
var winner;
// var oMoves
/*To Do:-
- Optimize Speed(starting randomly..)+Efficiency(using oMoves)
*/

function initialize(d,s){
	board=["E","E","E","E","E","E","E","E","E"];
	status="beginning";
	// turn="X";
	updateCells();
}

function displayResult(){
	if(winner==player){
		$("#alertBox").html('<div class="alert alert-success" role="alert">Congrats!! YOU WON!</div>');
	}else if(winner==computer){
		$("#alertBox").html('<div class="alert alert-danger" role="alert">Sorry, You Lose!</div>');
	}else{
		$("#alertBox").html('<div class="alert alert-warning" role="alert">Hey, it\'s a DRAW!</div>');
	}
}

function score(state) {
	if(whoWon(state)=="X"){
		return 10;
	}else if(whoWon(state)=="O"){
		return -10;
	}
	else{
		return 0;
	}
}

function toggleTurn(t){
	if (t=="X") {
		return "O";
	}
	else {
		return "X";
	}
}

function applyAction(state,movePosition,t) {
	var temp=state.slice();
	temp[movePosition]=t;
	return temp;
}

function minMaxVal(state,t) {
	var stateScore;
	if(isTerminal(state)){
		stateScore=score(state);
	}
	else{
		var available=emptyCells(state);
		var movePosition;
		for(var i=0;i<available.length;i++){
			var tempTurn=t;
			movePosition=available[i];
			var next=applyAction(state,movePosition,tempTurn);
			tempTurn=toggleTurn(tempTurn);
			var val=minMaxVal(next,tempTurn);
			if(i==0){
				stateScore=val;
			}else{
				if(t=="O"){// Min
					stateScore=Math.min(stateScore,val);
				}
				else{ // Max
					stateScore=Math.max(stateScore,val);
				}
			}
		}
	}
	return stateScore;
}

function makeExpertMove(state) {
	var available=emptyCells(state);
	var movePosition;
	var maxPos,minPos;
	var maxVal,minVal;
	for(var i=0;i<available.length;i++){
		var tempTurn=turn;
		movePosition=available[i];
		var next=applyAction(state,movePosition,tempTurn);
		tempTurn=toggleTurn(tempTurn);
		var val=minMaxVal(next,tempTurn);
		if(i==0){
			maxVal=val;
			minVal=val;
			maxPos=movePosition;
			minPos=movePosition;
		}
		else{
			if(maxVal<val){
				maxPos=movePosition;
				maxVal=val;
			}
			if(minVal>val){
				minPos=movePosition;
				minVal=val;
			}
		}
	}
	if(turn=="X"){//max
		var next=applyAction(state,maxPos,turn);
		board=next;
		updateCells();
		turn=toggleTurn(turn);
		beginMakeMove(board);
	}
	else{//Min
		var next=applyAction(state,minPos,turn);
		board=next
		updateCells();
		turn=toggleTurn(turn);
		beginMakeMove(board)
	}
}



function emptyCells(state) {
	var returnArr=[];
	for(var i=0;i<9;i++){
		if(state[i]=="E"){
			returnArr.push(i);
		}
	}
	return returnArr;
}

function isTerminal(state){
	// Rows Check
	for(var i=0;i<=6;i+=3){
		if(state[i]!="E" && state[i]==state[i+1] && state[i+1]==state[i+2]){
			return true;
		}
	}
	// Check Columns
	for(var i=0;i<=2;i++){
		if(state[i]!="E" && state[i]==state[i+3] && state[i+3]==state[i+6]){
			return true;
		}
	}
	// Check Diagonals
	for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if(state[i]!="E" && state[i]==state[i + j] && state[i + j]==state[i + 2*j]) {
            return true;
        }
    }
	// Check for draw
    var available=emptyCells(state);
    if(available.length==0){
    	return true;
    }
    else{
    	return false;
    }
}



function whoWon(state){
	// Check Row
	for(var i=0;i<=6;i+=3){
		if(state[i]!="E" && state[i]==state[i+1] && state[i+1]==state[i+2]){
			return state[i];
		}
	}
	// Check Columns
	for(var i=0;i<=2;i++){
		if(state[i]!="E" && state[i]==state[i+3] && state[i+3]==state[i+6]){
			return state[i];
		}
	}
	// Check Diagonals
	for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if(state[i]!="E" && state[i]==state[i + j] && state[i + j]==state[i + 2*j]) {        
            return state[i];
        }
    }
    return "No one";
}

function makeBeginnerMove(state) {
    var available=emptyCells(state);
    var movePosition = available[Math.floor(Math.random() * available.length)];
    var next=applyAction(state,movePosition,turn);
    board=next;
	updateCells();
	turn=toggleTurn(turn);
    beginMakeMove(board)
}

function makeMove(state){
	switch(difficulty){
		case "beginner":
			makeBeginnerMove(state);
			break;
		case "expert":
			makeExpertMove(state);
			break;
	}
}

function beginMakeMove(state) {
	currentState=state;
	if(isTerminal(currentState)){
		// console.log(currentState);
		status="ended";
		if(whoWon(currentState)=="X"){
			console.log("X wins");
			winner="X";
		}else if(whoWon(currentState)=="O"){
			console.log("O wins");
			winner="O";
		}
		else{
			console.log("Draw");
			winner="No One";
		}
		displayResult();
	}
	else if(turn==player){
		// console.log("Human Turn");
		$("#alertBox").html('<div class="alert alert-info" role="alert">It\'s Your Turn!</div>');
	}
	else{
		makeMove(currentState);
	}
}

function updateCells(){
	$(".cell").each(function(index){
		if(board[index]=="X"){
			$(this).html("<h3 class='redColor'>X</h3>");
		}
		else if(board[index]=="O"){
			$(this).html("<h3 class='greenColor'>O</h3>");
		}else{
			$(this).html("");
		}
	});
}

function initializeCells(){
	status="running"
	if(computer=="X"){
		$("#alertBox").html('<div class="alert alert-info" role="alert">It\'s Computer\'s Turn!</div>');
		turn=computer;
		beginMakeMove(board);
	}else{
		$("#alertBox").html('<div class="alert alert-info" role="alert">It\'s Your Turn!</div>');
		turn=player;
	}
}

$(document).ready(function () {
	$(".cell").click("on",function(){
		if(turn===player && $(this).html()==="" && status=="running"){
			var idx=Number($(this).attr("index"));
			board[idx]=player;
			updateCells();
			turn=toggleTurn(turn);
			beginMakeMove(board);
		}
	});
	
	$("input[name='playAs']").change("on",function(){
		player=$(this).val();
		if(player=="X"){
			computer="O";
		}else{
			computer="X";
		}
	});
	
	$("input[name='difficulty']").change(function(){
		difficulty=$(this).val();
	});
	
	$("#play").click("on",function(){
		$("#retry").removeAttr("disabled");
		initialize();
		initializeCells();
	});
	
	$("#retry").click("on",function(){
		initialize();
		initializeCells();
	});
});
