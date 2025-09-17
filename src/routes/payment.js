const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const {membershipType} = req.body
    const {firstName, lastName, email} = req.user
    //Creating the Order
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType]*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },
    });

    //Saving the response in database
    console.log(order);

    const payment = new Payment({
        userId: req.user._id,
        orderId: order.id,
        amount: order.amount,
        status: order.status,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
    })

    const savedPayment = await payment.save()

    //Return back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID});
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
