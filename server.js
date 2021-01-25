const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const INDEX = '/index.html';
const randomstring=require('randomstring');
const path = require("path");
//io.on('connection', () => { /* … */ });

app.use(express.static(path.join(__dirname,"public")));

io.on('connection', (socket) => {
	console.log('Client connected');
	socket.emit("player2Joined");
	socket.on('disconnect',() => console.log('Client disconnected'));

	socket.on("player2Joined",() =>{
		socket.emit("test");
	})

	socket.on("NewGame",() =>{
		const rand = randomstring.generate({length:4}).toLowerCase();
		socket.join(rand)
		socket.emit("RoomID", rand);
	})

	socket.on("Join",(data) =>{
		socket.join(data)
		socket.emit("player2Joined");
	})

	
  });

if(process.env.PORT){
	server.listen(process.env.PORT,function() {console.log('Server started')});
}

else{
	server.listen(3000,function() {console.log('Server started on port 3000')});
}