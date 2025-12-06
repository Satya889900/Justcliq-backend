import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
razorpayOrderId: { type: String, required: true },
razorpayPaymentId: { type: String },
razorpaySignature: { type: String },
amount: { type: Number, default: 0 }, // store paise if you wish
currency: { type: String, default: process.env.RAZORPAY_CURRENCY || "INR" },
status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
meta: { type: mongoose.Schema.Types.Mixed },
createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Payment", paymentSchema);