import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.services.js";
import crypto from "crypto"

const isLocalPaymentFallbackAllowed = () => {
  return process.env.ENABLE_LOCAL_PAYMENT_FALLBACK === "true" && process.env.CLIENT_URL?.includes("localhost");
};

const isMockOrderId = (orderId) => {
  return typeof orderId === "string" && orderId.startsWith("order_mock_");
};

export const createOrder = async (req,res) => {
    try {
        const {planId, amount, credits} = req.body;

    const paidPlans = {
      starter: { amount: 100, credits: 100 },
      popular: { amount: 200, credits: 250 },
      pro: { amount: 500, credits: 700 },
    };

    const selectedPlan = paidPlans[planId];
    if (!selectedPlan || selectedPlan.amount !== amount || selectedPlan.credits !== credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

     const options = {
      amount: selectedPlan.amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    let order;
    try {
      order = await razorpay.orders.create(options)
    } catch (error) {
      const isAuthFailure = error?.statusCode === 401 || error?.error?.description === "Authentication failed";

      if (!isAuthFailure || !isLocalPaymentFallbackAllowed()) {
        throw error;
      }

      order = {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        mock: true,
      };
    }

     await Payment.create({
      userId: req.userId,
      planId,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.json(order);

    
    } catch (error) {
         const description = error?.error?.description || error?.message || "Unable to create payment order";
         const statusCode = error?.statusCode === 401 ? 401 : 500;

         return res.status(statusCode).json({
          message: "Failed to create Razorpay order",
          error: description,
         })
    }
}


export const verifyPayment = async (req,res) => {
    try {
        const {razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature} = req.body

      const isMockPayment = isMockOrderId(razorpay_order_id);

      if (!isMockPayment) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    } else if (!isLocalPaymentFallbackAllowed()) {
      return res.status(400).json({ message: "Mock payments are only available on localhost" });
    }

     const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      return res.json({ message: "Already processed" });
    }

    // Update payment record
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
    await payment.save();

    // Add credits to user
    const updatedUser = await User.findByIdAndUpdate(payment.userId, {
      $inc: { credits: payment.credits }
    },{new:true});

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });

    } catch (error) {
         return res.status(500).json({message:`failed to verify Razorpay payment ${error}`})
    }
}








/*
export const createOrder = async (req, res) => {
    try {
        const {planId, amount, credits} = req.body;
        if (!planId || !credits) {
            return res.status(400).json({ message: "Invalid plan data"});
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

    } catch (error) {

    }
}*/
