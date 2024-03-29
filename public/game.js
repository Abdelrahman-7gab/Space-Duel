let socket = io();
var score1_span = document.getElementById("score1");
var score2_span = document.getElementById("score2");
var score3_span = document.getElementById("score3");
var score4_span = document.getElementById("score4");
var newGame_btn = document.getElementById("new");
var joinGame_btn = document.getElementById("join");
var RoomStatus_span = document.getElementById("RoomStatus");
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
var winning_div = document.getElementById("winningDIV");
var TheWinner = document.getElementById("TheWinner");
var rematchButton = document.getElementById("rematch");
var rematchMessage = document.getElementById("rematchMessage");


var three = document.getElementById("three");
three.style.backgroundColor = "green";
var five = document.getElementById("five");
var ten = document.getElementById("ten");

var selectAstro = document.getElementById("astroCHR");
selectAstro.style.backgroundColor = "purple";
var selectAlien = document.getElementById("alienCHR");


var firstICON = document.getElementById("astroHead");
var firstWinICON = document.getElementById("astroWinHead");
var secondICON = document.getElementById("alienHead");
var secondWinICON = document.getElementById("alienWinHead");
var goal = document.getElementById("Goal");
var crowd = document.getElementById("crowd");


var firstToGet = 3;
var firstCHAR = "Astronaut";
var secondCHAR = "Alien";
var letsRematch = false;


rematchButton.addEventListener('click', function () {

    letsRematch = true;

    socket.emit("rematchReq", roomID);


    if (!isleft)
        rematchMessage.textContent = "(Sent Rematch Request to opponent)"
    else
        rematchMessage.textContent = "(Your opponent left the room)"

})



selectAstro.addEventListener('click', function () {
    firstCHAR = "Astronaut";
    secondCHAR = "Alien";
    selectAstro.style.backgroundColor = "purple";
    selectAlien.style.backgroundColor = "";
})

selectAlien.addEventListener('click', function () {
    firstCHAR = "Alien";
    secondCHAR = "Astronaut";
    selectAstro.style.backgroundColor = "";
    selectAlien.style.backgroundColor = "purple";
})

three.addEventListener('click', function () {
    firstToGet = 3;
    goal.textContent = "Goal: 3";
    three.style.backgroundColor = "green";
    five.style.backgroundColor = "";
    ten.style.backgroundColor = "";
})

five.addEventListener('click', function () {
    firstToGet = 5;
    goal.textContent = "Goal: 5";
    three.style.backgroundColor = "";
    five.style.backgroundColor = "green";
    ten.style.backgroundColor = "";
})

ten.addEventListener('click', function () {
    firstToGet = 10;
    goal.textContent = "Goal: 10";
    three.style.backgroundColor = "";
    five.style.backgroundColor = "";
    ten.style.backgroundColor = "green";
})


var FirstPlayerScore = 0;
var SecondPlayerScore = 0;
var player = 2;



audio.loop = true;
sound.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        sound.src = "Photos/soundOn.png"
    } else {
        audio.pause();
        sound.src = "Photos/soundOff.png"
    }

})

newGame_btn.addEventListener('click', function () {
    socket.emit("NewGame");

    if (firstCHAR == "Alien") {
        firstICON.src = "Photos/AlienHead.png"
        firstWinICON.src = "Photos/AlienHead.png"
        secondICON.src = "Photos/AstroHead.png"
        secondWinICON.src = "Photos/AstroHead.png"
    }
})

var roomCreation = document.getElementById("RoomCreation");

socket.on("RoomID", function (data) {
    RoomStatus_span.innerHTML = ('"waiting for a second player" <br> Room Code:' + "<span style = 'color: orange;'>" + data + " </span>");
    roomCreation.style.display = "none";
    player = 1; // the player who recieves the room code is always the first player
    if (firstCHAR == "Astronaut")
        reposition();

})


function reposition() {

    //Bottom player becomes astronaut instead of alien and top becomes alien

    Paper_Pic.src = "Photos/Paper.png";
    paperDown_anim.src = "Photos/Paper.png";
    paperUp_anim.src = "Photos/PaperAlien.png";
    Rock_Pic.src = "Photos/Rock.png";
    rockDown_anim.src = "Photos/Rock.png";
    rockUp_anim.src = "Photos/RockAlienCatch.png";
    Scissors_Pic.src = "Photos/Scissors.png";
    scissorsDown_anim.src = "Photos/Scissors.png";
    scissorsUp_anim.src = "Photos/ScissorsAlien.png";

}

joinGame_btn.addEventListener('click', function () {
    if (textBox.value == "") {
        insertline.textContent = "Please insert code first"
    } else {
        socket.emit("Join", textBox.value.toLowerCase());
    }
})

socket.on("wrongCode", function () {
    if (player == 2)
        insertline.textContent = "the code is not correct"
})


socket.on("FullRoom", function () {
    if (player == 2)
        insertline.textContent = "This room is full";
})

function toGameSection() {
    Insert_div.style.display = "none";
    Room_sec.style.display = "none";
    game_sec.style.display = "block";
}

var roomID;
var select;

socket.on("player2Joined", function (ID) {
    roomID = ID;
    select = {
        choice: "n",
        room: ID
    }


    if (player == 1) {
        let prefs = {
            char: firstCHAR,
            room: ID,
            limit: firstToGet
        }
        socket.emit("userPrefs", prefs);

    }
    setTimeout(toGameSection, 500);
})

socket.on("changes", function (plot) {
    if (player == 2) {

        firstCHAR = plot.character;
        firstToGet = plot.num;

        if (plot.num === 3)
            goal.textContent = "Goal: 3";

        if (plot.num === 5)
            goal.textContent = "Goal: 5";

        if (plot.num === 10)
            goal.textContent = "Goal: 10";

        if (firstCHAR == "Astronaut")
            secondCHAR = "Alien";

        if (firstCHAR == "Alien") {
            secondCHAR = "Astronaut"
            reposition();
            firstICON.src = "Photos/AlienHead.png"
            firstWinICON.src = "Photos/AlienHead.png"
            secondICON.src = "Photos/AstroHead.png"
            secondWinICON.src = "Photos/AstroHead.png"
        }

    }
})

var firstChoice = "n"; //n for no choice.. changes to r / p / s
var secondChoice = "n"

Rock_Pic.addEventListener('click', function () {
    select.choice = "r"

    socket.emit("PlayerChoice" + player, select);
})

Paper_Pic.addEventListener('click', function () {
    select.choice = "p"
    socket.emit("PlayerChoice" + player, select);
})

Scissors_Pic.addEventListener('click', function () {
    select.choice = "s"
    socket.emit("PlayerChoice" + player, select);
})

socket.on("firstChoice", function (data) {
    firstChoice = data;
    if (secondChoice !== "n") {
        getWinner(firstChoice, secondChoice);
    } else {
        StatusMessage();
    }
})


socket.on("secondChoice", function (data) {
    secondChoice = data;
    if (firstChoice !== "n") {
        getWinner(firstChoice, secondChoice);
    } else {
        StatusMessage();
    }
})

var isleft = false;

socket.on("opponentLeft", function () {
    isleft = true;
    status_div.textContent = "Your opponent has left the game";
    rematchMessage.textContent = "(Your opponent left the room)";
    secondChoice = "n";
    firstChoice = "n";
})

socket.on("rematch?", function () {

    if (letsRematch)
        socket.emit("ok", roomID);

    else {
        rematchMessage.textContent = "(Your opponent wants a rematch)"
    }

})

socket.on("resetmatch", function () {

    FirstPlayerScore = 0;
    SecondPlayerScore = 0;
    score1_span.textContent = 0;
    score2_span.textContent = 0;
    score3_span.textContent = 0;
    score4_span.textContent = 0;
    score3_span.style = "color:white;";
    score4_span.style = "color:white;";
    winning_div.style.display = "none";
    gameContainer_div.style.display = "flex";
    game_sec.style.display = "block";
    status_div.textContent = "Make Your Move"
    crowd.textContent = "Rematch? why would I want to see that"
    rematchMessage.textContent = ""
    letsRematch = false;
})


function getStatus(letter) {
    if (isleft)
        return "Your opponent has left.";
    else if (letter == "r")
        return "You Selected ROCK, \r\nWaiting for opponent";
    else if (letter == "p")
        return "You Selected PAPER, \r\nWaiting for opponent";
    else if (letter == "s")
        return "You Selected Scissors, \r\nWaiting for opponent";
    else
        return "Your Opponent has selected.";
}

function StatusMessage() {
    if (player == 1)
        status_div.textContent = getStatus(firstChoice);

    else {
        status_div.textContent = getStatus(secondChoice);
    }
}

function getWinner(first, second) {
    let winner;
    if (first + second == "rs" || first + second == "sp" || first + second == "pr")
        winner = "first";
    else if (first + second == "sr" || first + second == "ps" || first + second == "rp")
        winner = "second";
    else
        winner = "draw";

    updateValues(winner);
}

var winnerIsAstro = ["<span style ='color:purple;'> Astronaut </span> just REKT the Alien!", "<span style ='color:purple'> Astronaut </span> confirms, this is EZ.", "<span style ='color:purple'>ASTRO </span> BOY IS ON FIIIRE!", "<span style ='color:purple'>NASA </span>is very proud", "Let <span style ='color:purple'>Astro </span>go back to earth already."];
var winnerIsAlien = ["YOU GOT <span style ='color:green'>ALIENISED </span>", "<span style ='color:green'>Alien: </span> I don't believe in humans", "Taste my <span style ='color:green'>green </span>victory", "<span style ='color:green'> Alien: </span> &#8523&#8513&#8487&#8479&#8524&#8523&#8513&#8487&#8479&#8524", "<span style ='color:green'>Alien: </span>haha Astro-NOT *nobody laughs*"];
var DRAWLIST = ["<span style ='color:gray'>Crowd: *BOOOOOOOO*</span>", "<span style ='color:gray'>DRAW? WHY ARE WE WATCHING THIS</span>", "<span style ='color:gray'>This is Booring</span>", "<span style ='color:gray'>Should've just watched netflix</span>", "<span style ='color:gray'>DRAW? THEY BOTH SUCK</span>"];


function winScreen(character) {

    winning_div.style.display = "grid";
    game_sec.style.display = "none";

    if (character == "Alien") {
        TheWinner.textContent = "THE ALIEN WINS THE GAME";
    } else {
        TheWinner.textContent = "THE ASTRONAUT WINS THE GAME";
    }
}

function updateValues(data) {
    let firstTemp = firstChoice;
    let secondTemp = secondChoice;
    var randomIndex = Math.floor(Math.random() * (5));

    if (player == 2) {
        firstTemp = secondChoice;
        secondTemp = firstChoice;
    }

    firstChoice = "n";
    secondChoice = "n";
    status_div.textContent = "Make Your Move";

    if (data == "first") {

        FirstPlayerScore += 1;

        if (FirstPlayerScore == firstToGet) {
            gameContainer_div.display = "none";
            setTimeout(winScreen, 3000, firstCHAR);
            score3_span.style = "color:green;";
            score4_span.style = "color:red;";
        }
        score1_span.textContent = FirstPlayerScore;
        score3_span.textContent = FirstPlayerScore;
        if (firstCHAR == "Astronaut")
            crowd.innerHTML = winnerIsAstro[randomIndex];
        else
            crowd.innerHTML = winnerIsAlien[randomIndex];
    } else if (data == "second") {
        SecondPlayerScore += 1;
        if (SecondPlayerScore == firstToGet) {
            gameContainer_div.display = "none";
            setTimeout(winScreen, 3000, secondCHAR);
            score4_span.style = "color:green;";
            score3_span.style = "color:red;";

        }
        score2_span.textContent = SecondPlayerScore;
        score4_span.textContent = SecondPlayerScore;
        if (firstCHAR == "Astronaut")
            crowd.innerHTML = winnerIsAlien[randomIndex];
        else
            crowd.innerHTML = winnerIsAstro[randomIndex];
    } else {
        crowd.innerHTML = DRAWLIST[randomIndex];
    }

    gameContainer_div.style.display = "none";



    if (firstTemp == "r") {
        rockDown_anim.classList.add("botAnim");
    } else if (firstTemp == "p") {
        paperDown_anim.classList.add("botAnim");
    } else {
        scissorsDown_anim.classList.add("botAnim");
    }

    if (secondTemp == "r") {
        rockUp_anim.classList.add("upAnim");
    } else if (secondTemp == "p") {
        paperUp_anim.classList.add("upAnim");
    } else {
        scissorsUp_anim.classList.add("upAnim");
    }


    setTimeout(hideAnimation, 3200);

}

function hideAnimation() {
    var botanimlist = document.getElementsByClassName("winAnimation");
    var upanimlist = document.getElementsByClassName("winAnimationUp");

    for (let i = 0; i < botanimlist.length; i++) {
        botanimlist[i].classList.remove("botAnim")
    }

    for (let j = 0; j < upanimlist.length; j++) {
        upanimlist[j].classList.remove("upAnim")
    }


    if (FirstPlayerScore != firstToGet && SecondPlayerScore != firstToGet)
        gameContainer_div.style.display = "flex";
}