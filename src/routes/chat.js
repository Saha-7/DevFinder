const express=require("express")

const chatRouter = express.Router()

chatRouter.post("/chat", async(req,res)=>{
    const{userId, targetUserId} = req.body

    try{
        let chat=
    }
})


module.exports = chatRouter