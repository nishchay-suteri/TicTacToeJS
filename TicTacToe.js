var board=["E","E","E","E","E","E","E","E","E"]
var difficulty="expert";// for the time being
var turn,result,status;// status=end,running,beginning
// var oMovesCount
// TURN KA PANGA HAI!!!!!!!!!!1

function toggleTurn(turni=turn) {
	if (turni=="X") {
		turni="O";
	}
	else {
		turni="X";
	}
}


function makeBeginnerMove(){

	console.log("Beginner Move");
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
    var available=emptyCells();
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
	toggleTurn();
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

function score(state) {
	if(whoWon(state)=="X"){
		// console.log("X wins");
		return 10;
	}else if(whoWon(state)=="O"){
		// console.log("O wins");
		return -10;
	}
	else{
		// console.log("Draw");
		return 0;
	}
}

function minMaxVal(state) {
	var stateScore;
	if(isTerminal(state)){
		stateScore=score(state);
	}else{
		var available=emptyCells(state);
		var movePosition;
		for(var i=0;i<available.length;i++){
			// var tempBoard=board;
			movePosition=available[i];
			var next=applyAction(state,movePosition);
			var val=minMaxVal(next);
			if(i==0){
				stateScore=val;
			}else{
				console.log("Max Or Min");
				// if Max then stateScore=max(stateScore,val) else min
			}
			// minMaxVal(next)
			// store the values in tuple Or something...
		}
	}
	return stateScore;
}



function makeExpertMove(state) {
	console.log("Expert Move");
	var available=emptyCells(state);
	var movePosition;
	for(var i=0;i<available.length;i++){
		// var tempBoard=board;
		movePosition=available[i];
		var next=applyAction(state,movePosition);
		// minMaxVal(next)
		// store the values in tuple Or something...
	}
	// best=if(MAX) choose Max value else min
	// var next=applyAction(state,best)
	// board=next;
	// insert in board ui
	// toggleTurn()
	// beginMakeMove(board)
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
		status="ended";
		if(whoWon(state)=="X"){
			console.log("X wins");
		}else if(whoWon(state)=="O"){
			console.log("O wins");
		}
		else{
			console.log("Draw");
		}
	}
	if(turn=="X"){
		makeMove(state);
	}else{
		console.log("Human turn")
	}
}

$(".cell").each(function() {
	var $this = $(this);
	$this.click(function() {
		if(status === "running") { // && turn === HumanTurn && this is blank
			// take value of that cell store it in idx

			// var next = new State(globals.game.currentState);
			// next.board[indx] = "X";
			// board[idx]="X";
			// ui.insertAt(indx, "X");
			// toggleTurn();
			// beginMakeMove(board);

		}
	})
});
