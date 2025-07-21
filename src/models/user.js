const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    email:{
        type: String,
        trim: true,
        required: true,
        lowercase: true, // Ensures email is stored in lowercase
        unique: true // Ensures that email is unique across users
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    age:{
        type: Number,
        min: 18
    },
    photoUrl:{
        type: String,
    },
    about:{
        type: String,
        default: "This is the about user section"
    },
    skills: {
        type: [String], // Array of strings to hold multiple skills
    }
},{
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

const User = mongoose.model('User', userSchema)
module.exports = User;