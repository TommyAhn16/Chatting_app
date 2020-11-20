// Declare empty user list
const users = [];

// Join user to user list
function add_user(name, room, id){
    const user = {name: name, room: room, id:id};
    users.push(user); 
    return user
}; 

// When user leaves chat room
function user_leaves(id) {
    // will return -1 when user name not found
    const target_index = users.findIndex(user => user.id === id); 
    if (target_index !== -1){
        // will get user out of the array
        return users.splice(target_index, 1)[0];
    }; 
}; 

// Get all users in the room
function get_all_users(room_name) {
    return users.filter(user => user.room === room_name);
};

// Get current user
function get_current_user(id) {
    // only select the user with matching id
    return users.find(user => user.id === id); 
};

// Find user by user name
function find_user_by_name(user_name, room_name){
    const user_list = get_all_users(room_name);
    const target_user = user_list.find(user => user.name === user_name);
    return target_user
}


// Export functions to be used externally
module.exports = {
    add_user, user_leaves, get_all_users, get_current_user, find_user_by_name
};