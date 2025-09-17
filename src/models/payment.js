const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firsName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
        enum: ["platinum", "gold"],
        default: "silver",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
