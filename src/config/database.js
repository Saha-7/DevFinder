const mongoose = require('mongoose')

const connectDB =async()=>{
    await mongoose.connect("mongodb+srv://saha7pritam:CBR250rr.@cluster0.7ebd5wu.mongodb.net/devFinder?tls=true")
}

module.exports = connectDB

