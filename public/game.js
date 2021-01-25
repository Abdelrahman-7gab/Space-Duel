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

var player1score = 0;
var player2score = 0;
var player = 2;


newGame_btn.addEventListener('click',function() {
    socket.emit("NewGame");
})

socket.on("RoomID",(data) =>{
    //RoomStatus_span.setAttribute('style', 'white-space: pre;');
    RoomStatus_span.textContent =('"waiting for a second player" \r\n Room Code:' + data );
   // RoomStatus_span.style.display = "block";
    newGame_btn.style.display = "none";
    joinGame_btn.style.display = "none";
    Insert_div.style.display = "none";
    player = 1; // the player who recieves the room code is always the first player
})

function toGameSection(){
    Insert_div.style.display = "none";
    Room_sec.style.display = "none";
    game_sec.style.display = "block";
}

joinGame_btn.addEventListener('click',function() {
    if(textBox.value == ""){
        insertline.textContent = "Please insert code first"
    }

    else {
        socket.emit("Join", textBox.value);
    }

  
})

socket.on("wrongCode",() =>{
    if(player == 2)
    insertline.textContent = "the code is not correct"
})


socket.on("FullRoom",() =>{
    if(player == 2)
    insertline.textContent = "This room is full";
})

socket.on("player2Joined",() =>{
    socket.emit("the game is ready");
})



