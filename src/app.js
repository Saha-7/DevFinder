const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const saltRounds = 13;


const app = express();
app.use(cookieParser())

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.
app.use(express.json()); // Middleware to parse JSON bodies

// Route to handle user signup
app.post("/signup", async (req, res) => {
  try {
  //Validation of data
  validateSignUpData(req)


  //Encrypt the password
  const {firstName, lastName, email, password} = req.body;
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log("Password hash:", passwordHash);


  //console.log("User data received:", req.body)
  const user = new User({
    firstName, lastName, email, password: passwordHash
  });
 // console.log("User data received:", req.body);
  
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});


app.post("/login", async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({email:email})
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password)
    if(isPasswordValid){
      // create JWT token
      const token = await user.getJWT()
      console.log("Token generated:", token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      })


      // Add the token inside Cookie
      res.send("Login successful");
    }else{
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error user: " + error.message);
  }
})

// Route to get Profile
app.get("/profile", userAuth, async (req, res) => {
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

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try{
    const user = req.user
    console.log("User sending connection request:", user.firstName, user.lastName);
    res.send(user.firstName+ " " + "sent you a connection request");
  }catch(err) {
    res.status(400).send("Error sending connection request: " + err.message);
  }
})

// Route to get user by email using Model.findOne()
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  console.log("User email received:", userEmail);
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("No user found with the provided email");
    }
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// Route to get user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.email;
//   try {
//     const users = await User.find({ email: userEmail });
//     console.log("Users found:", users);
//     if (users.length === 0) {
//       res.status(404).send("No user found with the provided email");
//     } else {
//       res.status(200).send(users);
//     }
//   } catch (error) {
//     res.status(500).send("Error fetching user: " + error.message);
//   }
// });

// Route to get all users (feed)
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});



// Route to Delete user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    // await User.findByIdAndDelete(userId)  //use any one of these two lines
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

// Route to update user by ID & data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Updates = [
      
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
    ];

    const isupdateAllowed = Object.keys(data).every((key) =>
      Allowed_Updates.includes(key)
    );
    if (!isupdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills.length>10){
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId , data, {
      runValidators: true
    });
    console.log("User updated:", user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
