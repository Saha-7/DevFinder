const validateSignUpData=(req)=>{
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(email)){
        throw
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}


module.exports = {
    validateSignUpData
}