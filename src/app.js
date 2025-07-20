const express = require('express')

const connectDB=require('./config/database')
const app=express()

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.

connectDB().then(()=>{
    console.log("Connected to database successfully")
    app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
}).catch((err)=>{
    console.log("Error connecting to database", err)})


