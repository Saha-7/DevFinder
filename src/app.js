require('dotenv').config()
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const http = require("http")



require('./utils/cronjob')


const app = express();
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", // Update with your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}))

// app.use() checks routes inside the code from top to bottom. As soon as first match comes the callback hits.

app.use(express.json()); // Middleware to parse JSON bodies

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const { userAuth } = require("./middlewares/auth");
const userRouter = require("./routes/user");
const paymentRouter = require('./routes/payment');
const chatRouter = require('./routes/chat')
const initializeSocket = require('./utils/socket');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter)
app.use("/", chatRouter)


const server = http.createServer(app)

// call the socket & pass the server
initializeSocket(server)


// Route to get user by email using Model.findOne()
// app.get("/user",userAuth,  async (req, res) => {
//   const userEmail = req.body.email;
//   console.log("User email received:", userEmail);
//   try {
//     const user = await User.findOne({ email: userEmail });
//     if (!user) {
//       res.status(200).send(user);
//     } else {
//       res.status(404).send("No user found with the provided email");
//     }
//   } catch (error) {
//     res.status(500).send("Error fetching users: " + error.message);
//   }
// });

// Route to get user by email
app.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ email: userEmail });
    console.log("Users found:", users);
    if (users.length === 0) {
      res.status(404).send("No user found with the provided email");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});

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
    server.listen(process.env.PORT, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
