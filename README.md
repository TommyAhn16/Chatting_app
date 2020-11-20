# CSE330
436788
## Usage
- After running 'npm install', type 'npm start' to start the server.
- Please do not refresh or use the back button while in chat room. This will give unwanted outputs (previous messages will disappear and user list would not refelect the current users in chat)
- You must create a chat room (either public or private) first to join chat.
- Private message can be sent selecting the option next to the message input tool bar. However, one cannot send private message to himself.
- You can only view the option of kicking or banning someone if you are the owner of the room. Owner of the room is determined by user name. Make sure to enter room with the same user name as the creator to access these options. 
- Note: for design purpose, available rooms are not visible while in the chat room but only when in the lobby. Additionally, private rooms are only visible if selecting 'Private Rooms' in the lobby.
## Creative Portion
- Owner display in chat room: users in the room will be able to see who the owner is for each room they are in. This was implemented by having a funcion in the server to find the owner of the each room and contiuously send it to the client for it to be displayed in the chat room. This extra feature would be useful when a user wants to request something to the owner. 
- Room deletion feature: the owner of the room can delete the room that he or she owns. It works by the owner clicking the button 'Delete' in the chat room display that only the owner of the room can see. If the room is deleted, all the users (including the owner) will be kicked out of the room and the room will be deleted from the list of rooms. This method was implementing a function in the server to iterate through all the users in the target room and kicking each users out. After that, the fuction will look for the room name in either the public or private room and delete it from the list. This extra feature will be useful when a owner no longer wants to manage the room and wants to delete the room as such.
- Creator view: If the user is the creator of the room, the view of the chat room will be different from rest of the users. From this view, the user is able to kick out or ban other users from chat.
- Below features were implemented by referencing a youtube video: https://www.youtube.com/watch?v=jD7FnbI76Hg. It was done in personal learning purposes and further development. I would require them not to be graded as most of them were following instructions:
- The message will display time of when it was sent.
- Message output box will scroll down automatically when it is full.
- The chatting bot will welcome a user if a user joins or notifiy other users if a user leaves room. 

## Reference
- socket.io reference code: https://socket.io/docs/v3/emit-cheatsheet/index.html
- qs node library: https://cdnjs.com/libraries/qs
- Tutorial video watched before writing code: https://www.youtube.com/watch?v=jD7FnbI76Hg
- Css and HTML frame was adopted from: https://github.com/bradtraversy/chatcord/_html_css
- Basic methods of server and client communication, message formating, room/user name selecting were referenced from :https://github.com/bradtraversy/chatcord
- Array methods referenced: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
- Html style display: https://www.w3schools.com/jsref/prop_style_display.asp 


