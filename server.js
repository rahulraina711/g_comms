const express = require('express');
const app = express();
const path = require('path');

const PORT = 3100 || process.env.PORT;

// Setting up static floder
app.use(express.static(path.join(__dirname, 'public')));

// Listening to port
app.listen(PORT, ()=>{
    console.log(`Server up and running on port : ${PORT}`);
})

