const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 13;
const authRouter = express.Router();

// Route to handle user signup
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    //console.log("Password hash:", passwordHash);

    //console.log("User data received:", req.body)
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    // console.log("User data received:", req.body);

    const saveduser = await user.save();
    // creating the JWT token
    const token = await user.getJWT();
    console.log("Token generated:", token);

    // Add the token inside the Cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    res.json({ message: "User created successfully", data: saveduser });
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create JWT token
      const token = await user.getJWT();
      console.log("Token generated:", token);

      // Add the token inside Cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Method 1: Create a new object with only safe fields
      const userDetail = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        age: user.age,
        gender: user.gender,
        about: user.about,
        skills: user.skills,
      };

      res
        .status(200)
        .json({ message: "Login Successfull!!", Data: userDetail });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error user: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

module.exports = authRouter;
