const express= require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const userRouter = express.Router()


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

// Get all the pending connection requests for the user
userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})


userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user

        // Get all the connections of the logged in user, user can be receiver or sender
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId:loggedInUser._id,status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        const Data = connectionRequests.map((row)=>{
            if(row.fromUserId?._id.toString() === loggedInUser._id.toString()){
                return row?.toUserId
            }
            return row?.fromUserId
        })

        res.json({
            message: "Data fetched successfully",
            data: Data
        })
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = userRouter