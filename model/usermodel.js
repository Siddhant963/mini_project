const mongoose = require('mongoose');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mini_project');



// Define the schema for the user collection
const userSchema = new mongoose.Schema({ 
     name: String,
     age: Number,
     email: String,
     password: String,
    post : [
     {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
     }
    ]

 });

 module.exports = mongoose.model('User', userSchema);

