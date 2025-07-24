const express = require('express');
const { userAuth } = require('../middlewares/auth');

const requestRouter = express.Router()

requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try{
    const user = req.user
    console.log("User sending connection request:", user.firstName, user.lastName);
    res.send(user.firstName+ " " + "sent you a connection request");
  }catch(err) {
    res.status(400).send("Error sending connection request: " + err.message);
  }
})






module.exports = requestRouter;