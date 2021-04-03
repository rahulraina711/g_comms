const express = require('express');
const path = require('path');
const http = require('http');

// Creating an express server to be used for Socket.io as well
const app = express();
const server = http.createServer(app);

// Setting up Port
const PORT = 3100 || process.env.PORT;

// Setting up static floder
app.use(express.static(path.join(__dirname, 'public')));

// Listening to port
server.listen(PORT, ()=>{
    console.log(`Server up and running on port : ${PORT}`);
})

