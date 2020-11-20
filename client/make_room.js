// Connect to socket io
const socket = io();
// Get elements to add event listeners
const room_info = document.getElementById('Room_info'); 

// Send public room info to server
room_info.addEventListener('submit', (e) =>{
    const creator = e.target.creator.value; 
    const room_name = e.target.room_name.value;
    socket.emit('room_info', {name: room_name, creator: creator});
    // redirect to index.html
    location.replace("index.html");
    // prevent continuous sumbition of files
    e.preventDefault();
}); 
