const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth =async (req, res, next) => {
    try{
        //Read the Token from the Req cookies
        const {token} = req.cookies
        if(!token){
            return res.status(401).send("Please Login")
        }

        // Validate the token
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

        const{_id} = decodedObj

        const user = await User.findById(_id)
        if(!user){
            throw new Error("User not found");
        }
        // Attaching user to the request object, So I don't needs to find it again in the route
        req.user=user
        next()

    }catch(err){
        res.status(400).send("Error in user authentication: " + err.message);
    }
};

module.exports = { userAuth };
