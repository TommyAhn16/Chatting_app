// Moment is a Node library to get current time
// Reference: This function was adopted from https://www.youtube.com/watch?v=jD7FnbI76Hg
const moments = require('moment');
const moment = moments(); 
function message_format(user_name, text, msg_type) { 
    return {
        user_name, text, time: moment.format('h:mm a'), msg_type
    }
}
// Export function to be used
module.exports = message_format;