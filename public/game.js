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

var player1score = 0;
var player2score = 0;
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

socket.on("player2Joined",function(){
    if(player == 2){
        Paper_Pic.src = "Photos/PaperAlien.png";
       // Rock_Pic.src = "Photos/RockAlien.png";
        Scissors_Pic.src = "Photos/ScissorsAlien.png";
       
    }

    toGameSection();
})



