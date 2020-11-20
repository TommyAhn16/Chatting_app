// Connect to socekt io
const socket = io();
// Get elements to add event listners
const room_html = document.getElementById('room'); 
const join_chat = document.getElementById('join_chat');

// Display the available rooms (public rooms)
socket.on('rooms', room_list => {
    room_list.forEach(room=>{
        const option = document.createElement('option');
        option.innerText = room['name'];
        option.value = room['name'];
        room_html.appendChild(option);
      });
} );

// Notify user if empty name is given for the room
join_chat.addEventListener('submit',e =>{
    const room_name = e.target.room.value;
    if (room_name === ''){
        alert('room name cannot be empty');
        location.replace('index.html');
        e.preventDefault(); 
    }
} )


