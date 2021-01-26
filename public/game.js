socket = io();
var score1_span = document.getElementById("score1");
var score2_span = document.getElementById("score2");
var newGame_btn = document.getElementById("new");
var joinGame_btn = document.getElementById("join");
var RoomStatus_span =document.getElementById("RoomStatus");
var Insert_div = document.getElementById("InsertDIV");
var Room_sec = document.getElementById("RoomSec");
var game_sec = document.getElementById("gameSec");
var textBox = document.getElementById("box");
var insertline = document.getElementById("insert");
var Paper_Pic = document.getElementById("paper");
var Rock_Pic = document.getElementById("rock");
var Scissors_Pic = document.getElementById("scissors");
var sound = document.getElementById("sound");
var audio = new Audio('mayday.mp3');
var paperDown_anim = document.getElementById("paperDown");
var paperUp_anim = document.getElementById("paperUp");
var rockDown_anim = document.getElementById("rockDown");
var rockUp_anim = document.getElementById("rockUp");
var scissorsDown_anim = document.getElementById("scissorsDown");
var scissorsUp_anim = document.getElementById("scissorsUp");
var gameContainer_div = document.getElementById("GameContainer");
var status_div = document.getElementById("status");

var AstronautScore = 0;
var AlienScore = 0;
var player = 2;



audio.loop = true;
sound.addEventListener('click',function() {
    if(audio.paused){
    audio.play();
    sound.src ="Photos/soundOn.png"
    }
    else{
        audio.pause();
        sound.src ="Photos/soundOff.png"
    }
    
})

newGame_btn.addEventListener('click',function() {
    socket.emit("NewGame");
})

socket.on("RoomID",function(data){
    //RoomStatus_span.setAttribute('style', 'white-space: pre;');
    RoomStatus_span.textContent =('"waiting for a second player" \r\n Room Code:' + data );
   // RoomStatus_span.style.display = "block";
    newGame_btn.style.display = "none";
    joinGame_btn.style.display = "none";
    Insert_div.style.display = "none";
    player = 1; // the player who recieves the room code is always the first player
    Paper_Pic.src = "Photos/Paper.png";
    paperDown_anim.src ="Photos/Paper.png";
    paperUp_anim.src = "Photos/PaperAlien.png";
    Rock_Pic.src = "Photos/Rock.png";
    rockDown_anim.src = "Photos/Rock.png";
    rockUp_anim.src = "Photos/RockAlienCatch.png";
    Scissors_Pic.src = "Photos/Scissors.png";
    scissorsDown_anim.src = "Photos/Scissors.png";
    scissorsUp_anim.src = "Photos/ScissorsAlien.png";
})

joinGame_btn.addEventListener('click',function() {
    if(textBox.value == ""){
        insertline.textContent = "Please insert code first"
    }

    else {
        socket.emit("Join", textBox.value);
    }
})

socket.on("wrongCode",function(){
    if(player == 2)
    insertline.textContent = "the code is not correct"
})


socket.on("FullRoom",function(){
    if(player == 2)
    insertline.textContent = "This room is full";
})

function toGameSection(){
    Insert_div.style.display = "none";
    Room_sec.style.display = "none";
    game_sec.style.display = "block";
}

var roomID;
var select;

socket.on("player2Joined",function(ID){
    roomID = ID;
        select = {
        choice : "n",
        room : ID
    }
    toGameSection();
})

var firstChoice = "n"; //n for no choice.. changes to r / p / s
var secondChoice = "n"

Rock_Pic.addEventListener('click',function() {
    select.choice = "r"

    socket.emit("PlayerChoice" + player, select);
})

Paper_Pic.addEventListener('click',function() {
    select.choice = "p"
    socket.emit("PlayerChoice" + player, select);
})

Scissors_Pic.addEventListener('click',function() {
    select.choice = "s"
    socket.emit("PlayerChoice" + player, select);
})

socket.on("firstChoice",function(data){
    firstChoice = data;
    if(secondChoice !== "n"){
        getWinner(firstChoice,secondChoice);
    }
    else{
        StatusMessage();
    }
})


socket.on("secondChoice",function(data){
    secondChoice = data;
    if(firstChoice !== "n"){
        getWinner(firstChoice,secondChoice);
    }
    else{
        StatusMessage();
    }
})

function getStatus(letter){
    if(letter == "r")
    return "You Selected ROCK, \r\nWaiting for opponent";
    else if(letter == "p")
    return "You Selected PAPER, \r\nWaiting for opponent";
    else if(letter == "s")
    return "You Selected Scissors, \r\nWaiting for opponent";
    else
    return "Your Opponent has selected.";
}

function StatusMessage(){
    if(player == 1)
    status_div.textContent = getStatus(firstChoice);

    else{
        status_div.textContent = getStatus(secondChoice);
    }
}

function getWinner(first,second){
    let winner;
    if(first+second == "rs" || first+second == "sp" || first+second =="pr")
    winner = "first";
    else if(first+second == "sr" || first+second == "ps" || first+second =="rp")
    winner="second";
    else
    winner = "draw";

    updateValues(winner);
}

function updateValues(data)
{
    let firstTemp = firstChoice;
    let secondTemp = secondChoice;

    if(player == 2){
        firstTemp = secondChoice;
        secondTemp = firstChoice;
    }

    firstChoice = "n";
    secondChoice = "n";

    if(data == "first"){

        AstronautScore +=1;
        score1_span.textContent = AstronautScore;
        }
    
        else if(data == "second"){
            AlienScore +=1;
            score2_span.textContent = AlienScore;  
        }

    gameContainer_div.style.display = "none";

    status_div.textContent = "Make Your Move";

    if(firstTemp == "r"){
        rockDown_anim.style.display = "block";
         }

  else if(firstTemp =="p"){
            paperDown_anim.style.display = "block";
        }

    else{
            scissorsDown_anim.style.display = "block";
        }

    if(secondTemp == "r"){
            rockUp_anim.style.display = "block";
         }

    else if(secondTemp =="p"){
              paperUp_anim.style.display = "block";
         }

    else{
               scissorsUp_anim.style.display = "block";
        }

    setTimeout(hideAnimation, 3200);
 
}
function hideAnimation(){
    animlist = document.getElementsByClassName("anim");
    for(let i = 0 ; i<animlist.length;i++){
        animlist[i].style.display = "none";
    }
    gameContainer_div.style.display = "flex";   
}








