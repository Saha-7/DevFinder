const express = require('express')
const { userAuth } = require('../middlewares/auth')
const paymentRouter = express.Router()
const razorpayInstance = require('../utils/razorpay')

paymentRouter.post("/payment/create", userAuth, async (req,res)=>{
    try{
        razorpayInstance.orders.create({
            "amount": 50000,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "receipt": "order_rcptid_11",
            notes: {
              "firstName": "value3",
              "lastName": "value2",
              membershipType: "silver"
            }
        })
    }catch(err){
        return res.status(500).json({message: "Razorpay Internal Server Error", error: err.message})
    }
})



module.exports = paymentRouter