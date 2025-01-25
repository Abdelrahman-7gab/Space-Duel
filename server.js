const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const INDEX = '/index.html';
const randomstring = require('randomstring');
const path = require("path");
const PORT = process.env.PORT || 3000;
let rooms = {};

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
	res.sendFile('index.html', {
		root: "public"
	});
});

io.on('connection', function (socket) {
	let socketRoom;

	socket.on("NewGame", function () {
		let rand = randomstring.generate({
			length: 4
		}).toLowerCase();
		while (rand in rooms) {
			rand = randomstring.generate({
				length: 4
			}).toLowerCase();
		}
		socketRoom = rand;
		socket.join(rand);
		rooms[rand] = 1;
		socket.nsp.to(rand).emit("RoomID", rand);
	})

	socket.on("Join", function (data) {
		//if(!io.sockets.adapter.get(data))
		if (!(data in rooms)) {
			console.log("wrong Code");
			socket.emit("wrongCode");
		} else if (rooms[data] == 2) {
			socket.emit("FullRoom");
		} else {
			socketRoom = data;
			socket.join(data);
			socket.nsp.to(data).emit("player2Joined", data);
			rooms[data] = 2;
		}
	})

	socket.on("PlayerChoice1", function (message) {
		socket.nsp.to(message.room).emit("firstChoice", message.choice)
	})

	socket.on("PlayerChoice2", function (message) {
		socket.nsp.to(message.room).emit("secondChoice", message.choice)
	})

	socket.on("userPrefs", function (prefs) {
		var done = {
			character: prefs.char,
			num: prefs.limit
		}
		socket.nsp.to(prefs.room).emit("changes", done);
	})


	socket.on("rematchReq", function (room) {
		socket.broadcast.to(room).emit("rematch?");
	})

	socket.on("ok", function (room) {
		socket.nsp.to(room).emit("resetmatch");
	})

	socket.on('disconnect', function () {
		socket.to(socketRoom).emit("opponentLeft");
		delete rooms[socketRoom];
	});

});

if (process.env.PORT) {
	server.listen(process.env.PORT, function () {
		console.log('Server started')
	});
} else {
	server.listen(3001, function () {
		console.log('Server started on port 3001')
	});
}