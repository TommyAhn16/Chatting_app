// Declare empty room lists
const rooms = [];
const private_rooms = [];

// Join created room to room lists
function add_room(creator, name){
    const room = {creator, name};
    // save room info to room list
    rooms.push(room);
}; 

// Join created private room to private room lists
function add_private_room(creator, name, password){
    const room = {creator, name, password};
    // save room info to room list
    private_rooms.push(room);
}; 

// Get room names
function get_room_list() {
    const room_list = []; 
    rooms.forEach(room => {
        room_list.push(room)
    }); 
    return room_list;
};

// Get private room names
function get_private_room_list() {
    const room_list = []; 
    private_rooms.forEach(room => {
        room_list.push(room)
    }); 
    return room_list;
};

// Deleting room from list
function delete_public_room(room_name) {
    // will return -1 when user name not found
    const target_index = rooms.findIndex(room => room.name === room_name); 
    if (target_index !== -1){
        // will get user out of the array
        return rooms.splice(target_index, 1);
    }; 
}; 

// Deleting private room from list
function delete_private_room(room_name) {
    // will return -1 when user name not found
    const target_index = private_rooms.findIndex(room => room.name === room_name); 
    if (target_index !== -1){
        // will get user out of the array
        return private_rooms.splice(target_index, 1);
    }; 
}; 

// Export functions to be used
module.exports = {
    add_room, add_private_room, get_room_list, get_private_room_list, delete_public_room, delete_private_room
};