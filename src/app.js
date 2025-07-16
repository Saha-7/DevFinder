const express = require('express')

const app=express()

app.use("/",(req,res)=>{
    res.send("Namaste")
})

app.use("/test",(req,res)=>{
    res.send("Testing page")
})

app.listen(3000, ()=>{
    console.log("server is running on port 7777")
})
