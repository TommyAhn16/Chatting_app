// Require the packages we will use:
const http = require("http");
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

// Require custum made files
const { add_room,
        add_private_room,
        get_room_list,
        get_private_room_list,
        delete_public_room,
        delete_private_room} = require('./helper/room_manage');
const {add_user, user_leaves, get_all_users, get_current_user, find_user_by_name} = require('./helper/user_manage');
const format_message = require('./helper/message_manage');
const message_format = require("./helper/message_manage");

// Variables 
const PORT = 3000 || process.env.PORT;
const folder = "client";
// global variablese
var rooms = [];
var private_rooms =[]; 
var banned_users = [{name:'',room:''}]; 

// Use Express to serve static folder/file
const app = express();
const server = http.createServer(app);

// Set static folder (will open index.html as default when accessed through port)
app.use(express.static(path.join(__dirname, folder)));

// Attach Socket.IO server to our HTTP server 
const io = socketio(server);

// Run when user connects to io
io.on("connection", socket => {
    // Get public room info when created
    socket.on('room_info', info => {
        // save room info
        const creator = info['creator'];
        const name = info['name'];
        // add room to room list
        add_room(creator, name); 
        // get room list
        rooms = get_room_list();
    });

    // Send list of room infos to client
    io.emit('rooms', rooms);

    // Get private room info when created
    socket.on('private_room_info', info => {
        // save room info
        const creator = info['creator'];
        const name = info['name'];
        const password = info['password'];
        // add room to room list
        add_private_room(creator, name, password); 
        // get room names
        private_rooms = get_private_room_list();
        
    });

    // Send list of private room infos to client
    io.emit('private_rooms', private_rooms);

    // Run when user joins chat room
    socket.on('join_room', (info)=>{
        // Save user info to user variable
        const user = add_user(info.user_name, info.room_name, socket.id);
        console.log(`${user.name} joined room: ${user.room}`); // show user info to check

        // add user to room user list
        socket.join(user.room);

        // send welcom message to user who joined
        socket.emit('message', format_message('Bot', `Welcome to room: ${user.room}`,'')); 

        // Broadcast when a user connects (notify everyone except for the user itself)
        socket.broadcast.to(user.room).emit('message', format_message('Bot',`${user.name} has joined the chat`,''));
    
        // Send users and room info
        io.to(user.room).emit('room_users',{
            room: user.room,
            users: get_all_users(user.room)
        }); 

        // Get owner of the room and send to room
        let owner = ''; 
        rooms.forEach(room =>{
            if (room['name'] === user.room){
                owner = room['creator'] ;
            }
        })
        // if owner not found in public room
        if(owner===''){
            private_rooms.forEach(room =>{
                if (room['name'] === user.room){
                    owner = room['creator'] ;
                }
            })
        }
        // Send owner information to client
        io.to(user.room).emit('owner', owner); 
    });
            
    // Run when chat message is sent by client
    socket.on('chat_message', msg_info => {
        // Get current user information
        const user = get_current_user(socket.id);
        // Get message type (public or private)
        const msg_to = msg_info.msg_to;

        // When message is public
        if (msg_to === 'All'){
            io.to(user.room).emit('message', format_message(user.name,msg_info.msg,''));
        }
        // When message is private
        else{
            // Find specific user to send message to
            const target_user = find_user_by_name(msg_to, user.room);
            // Send message to target and also to the person who sent it
            io.to(target_user.id).emit('message', format_message(user.name,msg_info.msg,'(Private)'));
            io.to(user.id).emit('message', format_message(user.name,msg_info.msg,'(Private)'));
        }
    });

    // When user exits room or gets kicked out
    socket.on('user_left_room', () => {
        // Remove user from user list
        const user = user_leaves(socket.id); 
        // Run when user is not null 
        if (user) {
        // Notify everyone in the room that a user left chat
        io.to(user.room).emit('message', message_format('Bot',`${user.name} has left the chat`,'')); 
        }
        // Send users and room info
        io.to(user.room).emit('room_users',{
            room: user.room,
            users: get_all_users(user.room)
        }); 
    });

    // When user is kicked out by room owner
    socket.on('kick_out_client', info =>{
        // Find kicked out user in user list
        const kick_user = find_user_by_name(info.user, info.room); 
        io.to(kick_user.room).emit('kick_server',{user:kick_user.name, room: kick_user.room})
    });
    // When user is banned from the room
    socket.on('ban_client', info =>{
        const ban_user = find_user_by_name(info.user, info.room);
        // kick out banned user from room first
        io.to(ban_user.room).emit('kick_server',{user:ban_user.name, room: ban_user.room})
        // save it to banned user list
        banned_users.push({name:ban_user.name,room:ban_user.room}); 
    });
    // emit banned users contiuously
    io.emit('banned_users',banned_users);

    socket.on('del_room_client', info =>{
        const del_room_users = get_all_users(info.room);
        // Kick all the users in room
        del_room_users.forEach(users => {
            io.to(info.room).emit('kick_server',{user:users.name, room: users.room});
        })

        // Remove room from public room list
        delete_public_room(info.room);
        // send updated public room list
        rooms = get_room_list()
        io.emit('rooms', rooms);

        // Remove room from private room list
        delete_private_room(info.room);
        // send updated private room list
        private_rooms = get_private_room_list();
        io.emit('private_rooms', private_rooms);
    })

}); 

// Listen for HTTP connections. Make sure the port number matches
server.listen(PORT, () => console.log(`server on ${PORT}`));
