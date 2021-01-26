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
var score1_span = document.getElementById("score1");
var score2_span = document.getElementById("score2");
var sound = document.getElementById("sound");
var audio = new Audio('mayday.mp3');

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
    Rock_Pic.src = "Photos/Rock.png";
    Scissors_Pic.src = "Photos/Scissors.png";  

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

var firstChoice = "n"; //for no choice.. changes to r / p / s
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
    if(secondChoice !== "n" && player == 1){
        getWinner(firstChoice,secondChoice);
    }
})


socket.on("secondChoice",function(data){
    secondChoice = data;
    if(firstChoice !== "n" && player == 2){
        getWinner(firstChoice,secondChoice);
    }
})

function getWinner(first,second){
    let winner;
    if(first+second == "rs" || first+second == "sp" || first+second =="pr")
    winner = "first";
    else if(first+second == "sr" || first+second == "ps" || first+second =="rp")
    winner="second";

    else
    winner = "draw";

    var winnerHolder= {
        player : winner,
        room : roomID
    }
    socket.emit("winner", winnerHolder);
}
socket.on("result",function(data){
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
})








