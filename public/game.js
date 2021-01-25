socket = io();
var player1score = 0;
var player2score = 0;
var score1_span = document.getElementById("score1");
var score2_span = document.getElementById("score2");
var newGame_btn = document.getElementById("new");
var joinGame_btn = document.getElementById("join");
var RoomStatus_span =document.getElementById("RoomStatus");
var Insert_div = document.getElementById("InsertDIV");
var firstplayer = 0;

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
    firstplayer = 1; // the player who recieves the room code is always the first player
})

joinGame_btn.addEventListener('click',function() {
    
  //io.sockets.adapter.get('roomId')
})