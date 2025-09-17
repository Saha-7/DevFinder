const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    
  try {
    //Creating the Order
    const order = await razorpayInstance.orders.create({
      amount: 50000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName: "value3",
        lastName: "value2",
        membershipType: "silver",
      },
    });

    //Saving the response in database
    console.log(order);

    //Return back my order details to frontend
    res.json({ order });
  } catch (err) {
    console.log("Full error object:", err);
    console.log("Error message:", err.message);
    console.log("Error description:", err.description);
    console.log("Error field:", err.field);
    console.log("Error source:", err.source);

    return res.status(500).json({
      message: "Razorpay Internal Server Error",
      error: err.message,
      description: err.description,
      field: err.field,
    });
  }
});

module.exports = paymentRouter;
