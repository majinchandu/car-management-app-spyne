const mongoose = require('mongoose')
const { type } = require('os')


const UserSchema = new mongoose.Schema({ //intiallising the schema of the users table
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true 
    }
})

module.exports = mongoose.model("User",UserSchema)