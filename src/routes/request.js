const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');

const requestRouter = express.Router()

const sendEmail = require("../utils/sendEmail")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId
    const status = req.params.status

    const allowedStatus = ["ignored", "interested" ]
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid Status type"
      })
    }

    const toUser = await User.findById(toUserId)
    if(!toUser){
      return res.status(404).json({
        message: "User not found"
      })
    }

    // If there is a connection request already exists between the two users
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    })
    if(existingConnectionRequest){
      return res.status(400).json({
        message: "Connection request already exists between these two users"
      })
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })

    const data = await connectionRequest.save()

    // FIXED: Make email sending non-blocking and handle errors properly
    try {
      const emailRes = await sendEmail.run(
        "A new friend request from " + req.user.firstName,
        req.user.firstName + " "+ status +  " " + toUser.firstName
      );
      console.log("Email sent successfully:", emailRes);
    } catch (emailError) {
      // Don't fail the entire request if email fails
      console.log("Email sending failed (but request succeeded):", emailError.message);
    }

    res.json({
      message: req.user.firstName + " "+ status +  " " + toUser.firstName,
      data
    })

  }catch(err) {
    res.status(400).send("Error: " + err.message);
  }
})




requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=> {
  try{
    
    const loggedInUser = req.user
    //loggedInUser is ==> toUserId
    // if Status is interested

    const {status, requestId} = req.params
    const allowedStatus = ["accepted", "rejected"]
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid Status type"
      })
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    })
    console.log(connectionRequest)
    if (!connectionRequest){
      return res.status(404).json({
        message: "connection request not found"
      })
    }

    // Update the status of the connection request
    connectionRequest.status= status

    // Save the updated connection request
    const data = await connectionRequest.save()
    console.log(data)

    res.json({
      message: "Connection request " + status + " successfully",
      data
    })


  }catch(err) {
    res.status(400).send("Error: " + err.message);
  }
})






module.exports = requestRouter;