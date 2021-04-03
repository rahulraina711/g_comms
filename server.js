const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage =require('./utils/messages');
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users');

// creating a bot for system generated calls
const botName = "GComms Bot"

// Creating an express server to be used for Socket.io as well
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting up static floder
app.use(express.static(path.join(__dirname, 'public')));

// run when a client connects
io.on('connection', socket=>{


    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // welcome new user
        socket.emit('message', formatMessage(botName,'Welcome to Global Comms'));

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the room`));

        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })



    // whena client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id);

        if (user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the room`));
        };
        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    // listen for chatMessage
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        //console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username ,msg));
    })
});

// Setting up Port
const PORT = process.env.PORT || 3100;

// Listening to port
server.listen(PORT, ()=>{
    console.log(`Server up and running on port : ${PORT}`);
});

