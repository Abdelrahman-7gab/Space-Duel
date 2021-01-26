const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const INDEX = '/index.html';
const randomstring=require('randomstring');
const path = require("path");
const PORT = process.env.PORT || 3000;
//io.on('connection', () => { /* … */ });
var rooms = []
var numberInrooms = []

app.use(express.urlencoded({ extended: true }));
const { render } = require('ejs');


//app.use(express.static(path.join(__dirname,'public')));

//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));


app.get('/',function(req,res){
	res.sendFile( 'index.html', { root: "public" });
  }); 

io.on('connection', function(socket){
	console.log('Client connected');
	socket.on('disconnect',() => console.log('Client disconnected'));

	socket.on("NewGame",function(){
		const rand = randomstring.generate({length:4}).toLowerCase();
		socket.join(rand);
		rooms.push(rand);
		socket.emit("RoomID", rand);
	})

	socket.on("Join",function(data){
		//if(!io.sockets.adapter.get(data))
		if(!rooms.includes(data))
		{
		console.log("wrong Code");
		socket.emit("wrongCode");
		}
		else if (numberInrooms[rooms.indexOf(data)] == 2){
			socket.emit("FullRoom");
		}
		else
		{
		console.log("JOINED");	
		socket.join(data);
		socket.nsp.to(data).emit("player2Joined");
		numberInrooms[rooms.indexOf(data)] = 2;
		}
	})

	
  });

if(process.env.PORT){
	server.listen(process.env.PORT,function() {console.log('Server started')});
}

else{
	server.listen(3000,function() {console.log('Server started on port 3000')});
}