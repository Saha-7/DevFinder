const express = require('express')

const app=express()

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.


app.use("/test",(req,res)=>{
    res.send("Testing page")
})

app.use("/hello/2",(req,res)=>{
    res.send("hello 2 page")
})

app.use("/hello",(req,res)=>{
    res.send("hello page")
})

app.use("/",(req,res)=>{
    res.send("Namaste")
})


app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
