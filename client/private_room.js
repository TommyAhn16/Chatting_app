// Connect to socket io
const socket = io();
// Get elements to add event listeners
const room_html = document.getElementById('room'); 
const join_chat = document.getElementById('join_chat');
const output_html = document.getElementById("try_again");

// Declare global variable for private room infos
var private_room_info = {name:'', password: '', creator:''};

// Receive private room list from server
socket.on('private_rooms', room_list => {
    private_room_info = room_list
    // make rooms into options to select
    room_html.innerHTML = '';
    room_list.forEach(room=>{
        const option = document.createElement('option');
        option.innerText = room['name'];
        option.value = room['name'];
        room_html.appendChild(option);
      });
} );

// Check and join user if input from user matches with the private room info
join_chat.addEventListener('submit',e =>{
    const user_name = e.target.username.value;
    const room_name = e.target.room.value;
    const room_pwd = e.target.pwd.value;
    // Find room with matching name
    const match_room = private_room_info.find(room => room.name === room_name); 
    // Notify if empty room name was given
    if (room_name === ''){
        alert('select valid room, cannot select empty room name');
        location.replace('join_private.html');
    }
    else{
        // Check if password matches
        if (room_pwd === match_room.password)
        {   
            // redirect to chat room with user name and room name
            const actions = document.getElementById("join_chat").action;
            const new_link = `${actions}?username=${user_name}&room=${room_name}`
            location.replace(new_link); 
        }
        else
        {   // notify user if wrong password was given
            alert('Wrong password. Try again');
            location.replace("join_private.html");
        }
    }
    e.preventDefault();
});
    



