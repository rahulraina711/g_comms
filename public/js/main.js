const chatForm = document.getElementById('chat-form');
const chatMessagesDiv = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});
//console.log(username, room);

const socket = io();

//Join chat room
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room , users})=>{
    outputRoomName(room);
    outputUsers(users);
})


// message from server
socket.on('message', message=>{
    //console.log(message);
    outputMessage(message);

    //scroll down every new message
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    // get message text 
    const msg = e.target.elements.msg.value;
    //console.log(msg);

    //emitting a message to the server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// output message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room){
    roomName.innerText = room
}

// add users to dom
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}