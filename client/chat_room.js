// Connect to socket io
const socket = io();
// Get Elements from html and assign variables
const owner_html = document.getElementById('owner'); 
const room_name_html = document.getElementById("room-name");
const chat_form = document.getElementById('chat-form');
const room_users_html = document.getElementById("users"); 
const chat_messages = document.querySelector('.chat-messages');
const room_exit_html = document.getElementById('exit_room'); 
const msg_type_html = document.getElementById('msg_type')
const ban_block_html = document.getElementById("ban");
const kick_out_html = document.getElementById('kick_out');
const kick_out_options = document.getElementById("k_user");
const ban_options = document.getElementById("users_ban") ;
const delete_room = document.getElementById("delete_room");
// Get current user name and room name from url(qs library was used)
/* Reference: Parsing method was referenced from https://www.youtube.com/watch?v=jD7FnbI76Hg */
const{username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true}); 
const user_name = username;
const room_name = room;

// Redirect if user is banned from room
socket.on('banned_users',user_list =>{
    user_list.forEach(user =>{
        if(user_name === user.name && room_name === user.room){
            socket.emit('user_left_room');
            alert(`You have been banned from room: ${room_name}`);
            location.replace('index.html');
        }
    }
    )
});

// Join chatroom as declared user name
socket.emit('join_room', {user_name, room_name});

// Redirect if user is kicked out
socket.on('kick_server',info =>{
    if(user_name === info.user && room_name === info.room){
        socket.emit('user_left_room');
        location.replace('index.html');
    }
});

// Display owner of room
socket.on('owner', owner => {
    owner_html.innerHTML = `<li><h3>${owner}</h3></li>`
    // Hide utils that only the owner should have access to
    if (owner !== user_name){
        ban_block_html.style.display = 'none';
        kick_out_html.style.display = 'none'; 
        delete_room.style.display = 'none';
    } 
})

// Get all the users in the chat room
socket.on('room_users', (info)=>{
    // Display name of the room
    room_name_html.innerText = info.room;
    user_name_list = []
    info.users.forEach(user =>{
        if (user_name_list.includes(user.name) === false)
            user_name_list.push(user.name);
    })

    // clear inner htmls in elements to write on
    room_users_html.innerHTML = '';
    kick_out_options.innerHTML = '';
    ban_options.innerHTML = '';
    // assign default value for type of message to 'All'
    msg_type_html.innerHTML = '<option value="All">All</option>';
    // append options
    user_name_list.forEach(user=>{
      const li = document.createElement('li');
      li.innerText = user;
      room_users_html.appendChild(li);
      // for private message options
      if(user !== user_name){ // prevent showing ownself in user options
      const option = document.createElement('option');
      option.value = user;
      option.innerHTML = user;
      msg_type_html.appendChild(option);
      };
      // for users to kick out options
      if(user !== user_name){ // prevent showing ownself in user options
        const option_1 = document.createElement('option');
        option_1.value = user;
        option_1.innerHTML = user;
        kick_out_options.appendChild(option_1);
      }
      // for users to ban options
      if(user !== user_name){ // prevent showing ownself in user options
        const option_2 = document.createElement('option');
        option_2.value = user;
        option_2.innerHTML = user;
        ban_options.appendChild(option_2);
      }
    });
})

// Listening for message from server
socket.on('message', message => {
    display_message(message); 
    // Scroll down to the end of box
    chat_messages.scrollTop = chat_messages.scrollHeight;
});

// Display message to chat room
function display_message(message) {
    const div = document.createElement('div'); 
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.user_name}<span> ${message.time}</span><span> ${message.msg_type}</span></p>
    <p class="text">${message.text}</p>`; 
    // add new div element to chat-message class
    document.querySelector('.chat-messages').appendChild(div);
}

// Submit message to server
chat_form.addEventListener('submit', (e) => {
    // prevents default action of submiting to a file
    e.preventDefault(); 
    // get message from the text input
    const msg = e.target.elements.msg.value;
    const msg_to = e.target.elements.msg_type.value;   
    // Emit message to server
    socket.emit('chat_message', {msg, msg_to}); 
    // Clear input
    e.target.elements.msg.value = '';
    // Put focus on the cleared input space
    e.target.elements.msg.focus();
})

// Notify to server that user exited the room
room_exit_html.addEventListener('submit', () =>{
    socket.emit('user_left_room');
});

// Notify to server that a user has been kicked out
kick_out_html.addEventListener('submit', e =>{
    e.preventDefault();
    const kick_user = e.target.k_user.value;
    // when user is not empty, emit message to server
    if (kick_user !== ''){
        socket.emit('kick_out_client', {user:kick_user, room:room_name});
    }
});

// Notify to server that a user has been banned from chat rrom
ban_block_html.addEventListener('submit', e =>{
    e.preventDefault();
    const ban_user = e.target.users_ban.value;
    // when user is not empty, emit message to server
    if (ban_user !== ''){
        socket.emit('ban_client', {user:ban_user, room:room_name});
    }
});

delete_room.addEventListener('submit', e=>{
    e.preventDefault();
    // Send to server that the owner wants to delete room
    socket.emit('del_room_client', {owner:user_name,room:room_name});
    
})