const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true, // Ensures email is stored in lowercase
      unique: true, // Ensures that email is unique across users
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male","female","others"],
        message: (props) =>`${props.value} is not a valid gender`
      }
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("PhotoURL is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is the about user section",
    },
    skills: {
      type: [String], // Array of strings to hold multiple skills
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// UserSchema Methods

userSchema.methods.getJWT = async function(){
    const user = this
    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' })

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid
}


const User = mongoose.model("User", userSchema);
module.exports = User;
// module.exports = mongoose.model("User", userSchema);