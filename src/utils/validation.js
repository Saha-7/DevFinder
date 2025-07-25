const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "skills",
    "about",
    "photoUrl",
    "gender",
    "age",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditFields.includes(field);
  });
  return isEditAllowed
};

// const validateEditPasswordData = (req) =>{
//     const {currentPassword, newPassword, confirmPassword} = req.body

//     // Check if all fields are provided
//     if(!currentPassword || !newPassword || !confirmPassword){
//         throw new Error("All fields are required");
//     }
//     // Check if new password and confirm password match
//     if(newPassword !== confirmPassword){
//         throw new Error("New password and confirm password do not match");
//     }
//     // check if new password is not the same as current password
//     if(currentPassword === newPassword){
//         throw new Error("New password cannot be the same as current password");
//     }
//     // 🔥 ADD THIS: Check password strength before saving
//     if(!validator.isStrongPassword(newPassword)){
//         throw new Error("Password is not strong enough. It should contain at least 8 characters with uppercase, lowercase, number and symbol");
//     }

//     return true
// }


module.exports = {
  validateSignUpData,
  validateEditProfileData,
  // validateEditPasswordData
};
