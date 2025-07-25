const express = require('express');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validateEditPasswordData } = require('../utils/validation');
//const saltRounds = 13;

const profileRouter = express.Router()


// Route to get Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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


profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
  try{
    if(!validateEditProfileData(req)){
      throw new Error("Invalid fields for profile edit");
    }
    const Loggededuser = req.user
   // console.log("Loggeded user:", Loggededuser);
    Object.keys(req.body).forEach((key) => {
      Loggededuser[key] = req.body[key];
    });
    await Loggededuser.save()
   // console.log("Updated user", Loggededuser)
   res.json({ message: "Profile updated successfully",
    data: Loggededuser
   })
  }catch(err){
    res.status(400).send("Error updating Profile Data: " + err.message);
  }
})



// profileRouter.patch("/profile/password", userAuth, async(req,res)=>{
//   try{
//     validateEditPasswordData(req)
//     const { currentPassword, newPassword} = req.body
//     const user = req.user

//     // SECURITY CHECK: Make sure user knows their current password before changing it
//     const isCurrentPasswordCorrect = await user.validatePassword(currentPassword)
//     if(!isCurrentPasswordCorrect){
//       throw new Error("Current password is incorrect");
//     }
    
//     // Update the password (pre-save middleware will hash it automatically)
//     user.password = newPassword
//     await user.save()

//     res.json({ 
//       message: "Password updated successfully"
//       // 🚫 NEVER send password back in response!
//     });
//   }
//   catch(err){
//     res.status(400).send("Error updating Password: " + err.message);
//   }
// })


module.exports = profileRouter;