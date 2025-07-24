const express = require('express');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');

const profileRouter = express.Router()


// Route to get Profile
profileRouter.get("/profile", userAuth, async (req, res) => {
   try{
    
    // These are old redundent codes, which are currently handled by userAuth middleware


// const cookies = req.cookies
//   //console.log("Cookies received:", cookies);

//   const {token} = cookies;
//   if(!token){
//     throw new Error("Invalid Token");
//   }
//   // Validate my token
//   const decodedMessage = await jwt.verify(token, "DevFinder@123");

//   const {_id} = decodedMessage;
//   console.log("Loggeded user ID:", _id);
//   const user = await User.findOne({_id: _id});
//  // console.log("User found:", user?.firstName+ " "+user?.lastName);
//   if(!user){
//     throw new Error("User not found");
//   }

  const user = req.user
  res.json(user);
  }catch(err){
    res.status(400).send("Error getting Profile Data: " + err.message);
  }
})



module.exports = profileRouter;