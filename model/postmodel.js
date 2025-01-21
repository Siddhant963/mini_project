const mongoose = require('mongoose');


// Define the schema for the user collection
const postSchema = new mongoose.Schema({ 
     user : { 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'  // reference to the User collection
     },
     content: String,
     createdAt: { 
          type: Date, 
          default: Date.now 
     }

 });

 module.exports = mongoose.model('post', postSchema);
 
