const express = require('express')
const connectDB=require('./config/database')
const User = require('./models/user')
const app=express()

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.
app.use(express.json()) // Middleware to parse JSON bodies

app.post("/signup",async (req, res) => {

    //console.log("User data received:", req.body)
   const user = new User(req.body)
   console.log("User data received:", req.body)
   try {
       const savedUser = await user.save()
       res.send("User created successfully")
   } catch (error) {
       res.status(400).send("Error creating user: " + error.message)
   }
})   


connectDB().then(()=>{
    console.log("Connected to database successfully")
    app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
}).catch((err)=>{
    console.log("Error connecting to database", err)})


