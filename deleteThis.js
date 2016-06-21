var board=["E","E","E","E","E","E","E","E","E"]
var difficulty="expert";// for the time being
var turn,result,status="beginning";// status=end,running,beginning
var player,computer;

// var oMovesCount


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

function toggleTempTurn(t){
	if (t=="X") {
		return "O";
	}
	else {
		return "X";
	}
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
			// var tempBoard=board;
			var tempTurn=t;
			movePosition=available[i];
			var next=applyTempAction(state,movePosition,tempTurn);
			tempTurn=toggleTempTurn(tempTurn);
			var val=minMaxVal(next,tempTurn);
			// var val=minMaxVal(next);
			if(i==0){
				stateScore=val;
			}else{
				// console.log("Max Or Min");
				if(t=="O"){
					// Min
					stateScore=Math.min(stateScore,val);
					// console.log("Min");
				}
				else if(t=="X"){
					// Max
					stateScore=Math.max(stateScore,val);
					// console.log("max");
				}else{
					console.log("undefined");
				}
				// if Max then stateScore=max(stateScore,val) else min
			}
			// minMaxVal(next)
			// store the values in tuple Or something...
		}
	}
	return stateScore;
}

function applyTempAction(state,movePosition,t) {
	var temp=state.slice();
	temp[movePosition]=t;
	return temp;
}

function makeExpertMove(state) {
	console.log("Expert Move");
	var available=emptyCells(state);
	// console.log(available.length);
	var movePosition;
	var maxPos,minPos;
	var maxVal,minVal;
	for(var i=0;i<available.length;i++){
		// var tempBoard=board;
		var tempTurn=turn;
		movePosition=available[i];
		var next=applyTempAction(state,movePosition,tempTurn);
		// console.log(board);
		tempTurn=toggleTempTurn(tempTurn);
		var val=minMaxVal(next,tempTurn);
		if(i==0){
			maxVal=val;
			minVal=val;
			maxPos=movePosition;
			minPos=movePosition;
		}else{
			if(maxVal<val){
				maxPos=movePosition;
				maxVal=val;
			}
			if(minVal>val){
				minPos=movePosition;
				minVal=val;
			}
		}
		// store the values in tuple Or something...
	}
	if(turn=="X"){//max
		var next=applyAction(state,maxPos);
		board=next;
		updateCells();
		// console.log(board);
		toggleTurn();
		beginMakeMove(board);
	}else if(turn=="O"){
		var next=applyAction(state,minPos);
		board=next
		updateCells();
		// console.log(board);
		toggleTurn();
		beginMakeMove(board)
	}
	// best=if(MAX) choose Max value else min
	// var next=applyAction(state,best)
	// board=next;
	// insert in board ui
	// toggleTurn()
	// beginMakeMove(board)
}

function toggleTurn() {
	if (turn=="X") {
		turn="O";
	}
	else {
		turn="X";
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
			// result=state[i]+"-won";
			return true;
		}
	}
	// Check Columns
	for(var i=0;i<=2;i++){
		if(state[i]!="E" && state[i]==state[i+3] && state[i+3]==state[i+6]){
			// result=state[i]+"-won";
			return true;
		}
	}
	// Check Diagonals
	for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if(state[i]!="E" && state[i]==state[i + j] && state[i + j]==state[i + 2*j]) {
            // result = state[i] + "-won";
            return true;
        }
    }
    var available=emptyCells(state);
    if(available.length==0){
    	// result="draw";
    	return true;
    }
    else{
    	return false;
    }
}

function applyAction(state,movePosition) {
	var temp=state;
	temp[movePosition]=turn;
	return temp;
}

function whoWon(state) {
	for(var i=0;i<=6;i+=3){
		if(state[i]!="E" && state[i]==state[i+1] && state[i+1]==state[i+2]){
			// result=state[i]+"-won";
			return state[i];
			// return true;
		}
	}
	// Check Columns
	for(var i=0;i<=2;i++){
		if(state[i]!="E" && state[i]==state[i+3] && state[i+3]==state[i+6]){
			// result=state[i]+"-won";
			return state[i];
			// return true;
		}
	}
	// Check Diagonals
	for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
        if(state[i]!="E" && state[i]==state[i + j] && state[i + j]==state[i + 2*j]) {
            // result = state[i] + "-won";
            // return true;
            return state[i];
        }
    }
    return "No one";
}

function makeBeginnerMove(state) {
    var available=emptyCells(state);
    var movePosition = available[Math.floor(Math.random() * available.length)];
    var next=applyAction(state,movePosition);
    board=next
	updateCells();
	// console.log(board);
	toggleTurn();
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
	console.log(turn+"'s turn");
	console.log(board);
	if(isTerminal(currentState)){
		console.log(currentState);
		status="ended";
		if(whoWon(currentState)=="X"){
			console.log("X wins");
		}else if(whoWon(currentState)=="O"){
			console.log("O wins");
		}
		else{
			console.log("Draw");
		}
	}
	else if(turn==player){
		// console.log(board);
		console.log("Human Turn");
		// makeMove(currentState);
	}
	else{
		// console.log("Board="+board);
		// console.log("Human turn")
		makeMove(currentState);
	}
}

function updateCells(){
	$(".cell").each(function(index){
		if(board[index]=="X")
			$(this).html("X");
		else if(board[index]=="O"){
			$(this).html("O");
		}
	});
}

function initializeCells(){
	status="running"
	if(computer=="X"){
		// var available=emptyCells(board);
		// var movePosition = available[Math.floor(Math.random() * available.length)];
		// turn="X";
		// board[movePosition]=turn;
		// toggleTurn();
		// updateCells();	
		turn=computer;
		beginMakeMove(board);
	}else{
		turn=player;
	}
}

$(document).ready(function () {
	$(".cell").click("on",function(){
		if(turn===player && $(this).html()==="" && status=="running"){
			// console.log(status);
			var idx=Number($(this).attr("index"));
			board[idx]=player;
			updateCells();
			toggleTurn();
			beginMakeMove(board);
		}
	});
	
	$(".btn").click("on",function(){
		player=$(this).text();
		if(player=="X"){
			computer="O";
		}else{
			computer="X";
		}
		initializeCells();
	});
});
