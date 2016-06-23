var turn,result,winner;
// Default Conditions:-
var board=["E","E","E","E","E","E","E","E","E"]; // 9 element(3X3) of board... E=Empty
var difficulty="beginner"; // Difficulty level
var status="beginning"; // Game status
var player="X";
var computer="O";
var firstComputerMove=false; // To check whether computer plays first or not... (used for calculating faster initial move)
var depth=0; // Depth of the game tree

function initialize(){// Initialization of Variables
	board=["E","E","E","E","E","E","E","E","E"];
	status="beginning";
	depth=0;
	firstComputerMove=false;
	updateUI(); // display the updated board
}

function updateUI(){ // // display the updated board
	$(".cell").each(function(index){
		if(board[index]=="X"){
			$(this).html("<h3 class='redColor'>X</h3>"); // red color for X
		}
		else if(board[index]=="O"){
			$(this).html("<h3 class='greenColor'>O</h3>"); // Green color for O
		}else{
			$(this).html(""); // Empty box
		}
	});
}

function initializeCells(){ // initialize gameplay to start the game
	status="running"
	if(computer=="X"){
		$("#alertBox").html('<div class="alert alert-info" role="alert">It\'s Computer\'s Turn!</div>');
		turn=computer;
		firstComputerMove=true;
		beginMakeMove(board);
		
	}else{
		$("#alertBox").html('<div class="alert alert-info" role="alert">It\'s Your Turn!</div>');
		turn=player;
	}
}

// Functions that are required by both beginner and expert:-
//==================================================================X=======================================================//

function toggleTurn(t){ // returns the opposite of t... Note: Do not update the current t
	if (t=="X") {
		return "O";
	}
	else {
		return "X";
	}
}

function applyAction(state,movePosition,t) { // Applies t to the movePosition box of the state
	var temp=state.slice(); // copy the current state... Do not update the state
	temp[movePosition]=t;
	return temp;
}

function displayResult(){ // displays the final result
	if(winner==player){
		$("#alertBox").html('<div class="alert alert-success" role="alert">Congrats!! YOU WON!</div>');
	}else if(winner==computer){
		$("#alertBox").html('<div class="alert alert-danger" role="alert">Sorry, You Lose!</div>');
	}else{
		$("#alertBox").html('<div class="alert alert-warning" role="alert">Hey, it\'s a DRAW!</div>');
	}
}

function emptyCells(state) { // returns available positions(blank) to make the moves
	var returnArr=[];
	for(var i=0;i<9;i++){
		if(state[i]=="E"){
			returnArr.push(i);
		}
	}
	return returnArr;
}

function isTerminal(state){ // checks if the state is terminal or not
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

function whoWon(state){ // returns the winner of current state
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

function beginMakeMove(state) { // decides whose move is required
	currentState=state;
	if(isTerminal(currentState)){ // if the game is over or not
		status="ended";
		if(whoWon(currentState)=="X"){
			winner="X";
		}else if(whoWon(currentState)=="O"){
			winner="O";
		}
		else{
			winner="No One";
		}
		displayResult();
	}
	else if(turn==player){ // if it's player's turn
		$("#alertBox").html('<div class="alert alert-info" role="alert">It\'s Your Turn!</div>');
	}
	else{ // if it's computer's turn
		makeMove(currentState);
	}
}

function makeMove(state){ // makes moves based on the difficulty
	switch(difficulty){
		case "beginner":
			makeBeginnerMove(state);
			break;
		case "expert":
			if(firstComputerMove){ // if it is first move of computer, no need to calculate min-max value 
				// since it is independent of the board(since board is empty), 
				// so every time min-max algo returns the corner state
				var pos=cornerStates();
				board[pos]="X";
				depth+=1;
				updateUI();
				turn=toggleTurn(turn);
				firstComputerMove=false;
				beginMakeMove(board);
			}else{
				makeExpertMove(state);// find the best move using min-max algo and make the move
			}
			break;
	}
}

// Beginner's Play:-
//=================================================================X===========================================================//

function makeBeginnerMove(state) { // update board as beginner's move
    var available=emptyCells(state);
    var movePosition = available[Math.floor(Math.random() * available.length)]; // randomly applies move to the board
    var next=applyAction(state,movePosition,turn);
    board=next;
	depth+=1; // No need of depth in beginner play
	updateUI();
	turn=toggleTurn(turn);
    beginMakeMove(board);
}

// Expert's play:-
//===================================================================X========================================================//

function cornerStates(){ // returns corner box of the board randomly
	var corner=[0,2,6,8];
	var position=corner[Math.floor(Math.random() * corner.length)];
	return position;
}

function score(state,d) { // Score of the terminal state in game tree(min max value)
	// whoWon(state) returns the winner of the state
	// Note: We cannot use winner variable here since winner variable is for actual winner in the game
	if(whoWon(state)=="X"){
		return 10-d;
	}else if(whoWon(state)=="O"){
		return d-10;
	}
	else{
		return 0;
	}
}

function minMaxVal(state,t,d) { // returns min-max value of the state having turn t and at depth d in the game tree
	var stateScore; // stores the min-max value of the current state
	if(isTerminal(state)){
		stateScore=score(state,d);
	}
	else{
		var available=emptyCells(state); // returns all the empty positions in the current state
		var movePosition;
		for(var i=0;i<available.length;i++){ // for every child of current state
			var tempTurn=t;
			var tempDepth=d;
			movePosition=available[i];
			var next=applyAction(state,movePosition,tempTurn);
			tempTurn=toggleTurn(tempTurn);
			tempDepth+=1;
			var val=minMaxVal(next,tempTurn,tempDepth); // recursive call
			if(i==0){ // first child of the current state
				stateScore=val;
			}else{ // for subsequent children of current state
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

function makeExpertMove(state) { // updates Board to make expert's turn
	var available=emptyCells(state);
	var movePosition;
	var maxPos,minPos;
	var maxVal,minVal;
	for(var i=0;i<available.length;i++){ // for every child of current state
		var tempTurn=turn;
		var d=depth;
		movePosition=available[i];
		var next=applyAction(state,movePosition,tempTurn);
		d+=1;
		tempTurn=toggleTurn(tempTurn);
		var val=minMaxVal(next,tempTurn,d); // min-max value for current child
		if(i==0){ // if it is first child
			maxVal=val;
			minVal=val;
			maxPos=movePosition;
			minPos=movePosition;
		}
		else{
			if(maxVal<val){ // for keeping track of maximum min-max value
				maxPos=movePosition;
				maxVal=val;
			}
			if(minVal>val){ // for keeping track of minimum min-max value
				minPos=movePosition;
				minVal=val;
			}
		}
	}
	if(turn=="X"){// Max
		var next=applyAction(state,maxPos,turn);
		board=next;
		depth+=1;
		updateUI();
		turn=toggleTurn(turn);
		beginMakeMove(board);
	}
	else{// Min
		var next=applyAction(state,minPos,turn);
		board=next
		depth+=1;
		updateUI();
		turn=toggleTurn(turn);
		beginMakeMove(board)
	}
}

// End of playing Logic
//===============================================================X=============================================================//


$(document).ready(function () {
	$(".cell").click("on",function(){ // marks player's move
		if(turn===player && $(this).html()==="" && status=="running"){
			var idx=Number($(this).attr("index"));
			board[idx]=player;
			updateUI();
			depth+=1;
			turn=toggleTurn(turn);
			beginMakeMove(board);
		}
	});
	
	$("input[name='playAs']").change("on",function(){ // decides whether player wants to play as X or O
		player=$(this).val();
		if(player=="X"){
			computer="O";
		}else{
			computer="X";
		}
	});
	
	$("input[name='difficulty']").change(function(){ // assigns difficulty of the game
		difficulty=$(this).val();
	});
	
	$("#play").click("on",function(){ // start the game
		$("#retry").removeAttr("disabled");
		initialize();
		initializeCells();
	});
	
	$("#retry").click("on",function(){ // reset the game
		initialize();
		initializeCells();
	});
});
