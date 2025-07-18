const express = require('express')

const app=express()

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.

// app.get("/test",(req,res)=>{
//     res.send({"name":"Pritam Saha", "age":25})
// })

app.use("/",(req,res,next)=>{
   // res.send({"name":"Pritam Saha", "age":25})
   console.log("1st route handler")
   res.send("Hello")
   next()
   
},
(req,res)=>{
    console.log("2nd route handler")
    res.send("Hello 2")
})

// app.delete("/test",(req,res)=>{
//     res.send("Data deleted successfully")
// })

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
