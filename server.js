const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const INDEX = '/index.html';
const randomstring=require('randomstring');
const path = require("path");
//io.on('connection', () => { /* … */ });

app.use(express.static(path.join(__dirname,"public")));

if(process.env.PORT){
	server.listen(process.env.PORT,function() {console.log('Server started')});
}

else{
	server.listen(3000,function() {console.log('Server started on port 3000')});
}