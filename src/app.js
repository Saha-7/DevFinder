const express = require('express')

const app=express()

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.



app.use("/",(err,req,res,next)=>{
   if(err){
    res.status(500).send("Something went wrong")
   }
})

app.get("/test",(req,res)=>{
   // res.send({"name":"Pritam Saha", "age":25})
   throw new Error("efrtg")
})

app.use("/",(err,req,res,next)=>{
   if(err){
    res.status(500).send("Something went wrong")
   }
})


app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})
