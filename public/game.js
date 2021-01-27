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
var three = document.getElementById("three");
three.style.backgroundColor = "green";

var five = document.getElementById("five");
var ten = document.getElementById("ten");

var selectAstro = document.getElementById("astroCHR");
selectAstro.style.backgroundColor = "purple";
var selectAlien = document.getElementById("alienCHR");


var firstICON = document.getElementById("astroHead");
var secondICON = document.getElementById("alienHead");


var firstToGet = 3;
var firstCHAR = "Astronaut"; 
var secondCHAR = "Alien"; 

selectAstro.addEventListener('click',function(){
         firstCHAR = "Astronaut";
         secondCHAR = "Alien"; 
         selectAstro.style.backgroundColor = "purple";
         selectAlien.style.backgroundColor ="";
    })

selectAlien.addEventListener('click',function(){
        firstCHAR = "Alien";
        secondCHAR = "Astronaut"; 
        selectAstro.style.backgroundColor = "";
        selectAlien.style.backgroundColor ="purple";
        firstICON.src = "Photos/AlienHead.png"
        secondICON.src = "Photos/AstroHead.png"
        })

three.addEventListener('click',function(){
    firstToGet = 3;
    three.style.backgroundColor = "green";
    five.style.backgroundColor = "";
    ten.style.backgroundColor = "";
    })

five.addEventListener('click',function(){
    firstToGet = 5;
    three.style.backgroundColor = "";
    five.style.backgroundColor = "green";
    ten.style.backgroundColor = "";
    })

ten.addEventListener('click',function(){
firstToGet = 10;
three.style.backgroundColor = "";
five.style.backgroundColor = "";
ten.style.backgroundColor = "green";
})


var FirstPlayerScore = 0;
var SecondPlayerScore = 0;
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

var roomCreation = document.getElementById("RoomCreation");

socket.on("RoomID",function(data){
    //RoomStatus_span.setAttribute('style', 'white-space: pre;');
    RoomStatus_span.textContent =('"waiting for a second player" \r\n Room Code:' + data );
   // RoomStatus_span.style.display = "block";
   roomCreation.style.display = "none";
    player = 1; // the player who recieves the room code is always the first player
    if(firstCHAR == "Astronaut")
    reposition();

})

function reposition(){

    //Bottom player becomes astronaut instead of alien and top becomes alien

    Paper_Pic.src = "Photos/Paper.png";
    paperDown_anim.src ="Photos/Paper.png";
    paperUp_anim.src = "Photos/PaperAlien.png";
    Rock_Pic.src = "Photos/Rock.png";
    rockDown_anim.src = "Photos/Rock.png";
    rockUp_anim.src = "Photos/RockAlienCatch.png";
    Scissors_Pic.src = "Photos/Scissors.png";
    scissorsDown_anim.src = "Photos/Scissors.png";
    scissorsUp_anim.src = "Photos/ScissorsAlien.png";

}

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


    if(player == 1){
   let prefs = {
        char: firstCHAR,
        room : ID,
        limit: firstToGet
    }
    socket.emit("userPrefs",prefs);

}
    setTimeout(toGameSection, 500);
})

socket.on("changes",function(plot){
    if(player == 2){
    firstCHAR = plot.character;
    firstToGet = plot.num;


    if(firstCHAR == "Alien"){
        secondCHAR ="Astronaut"
    reposition();
    firstICON.src = "Photos/AlienHead.png"
    secondICON.src = "Photos/AstroHead.png"
    }

    }
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
    status_div.textContent = "Make Your Move";

    if(data == "first"){

        FirstPlayerScore +=1;

        if(FirstPlayerScore == firstToGet){
            status_div.textContent = firstCHAR + " WINS!";
        }
        score1_span.textContent = FirstPlayerScore;
        }
    
        else if(data == "second"){
            SecondPlayerScore +=1;
            if(SecondPlayerScore == firstToGet){
                status_div.textContent = secondCHAR + " WINS!";
            }
            score2_span.textContent = SecondPlayerScore;  
        }

    gameContainer_div.style.display = "none";

    

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








