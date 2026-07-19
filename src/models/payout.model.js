import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        saleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sale",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            enum: ["ADVANCE", "FINAL", "ADJUSTMENT"],
            required: true
        },

        status: {
            type: String,
            enum: ["SUCCESS", "FAILED", "CANCELLED"],
            default: "SUCCESS"
        }
    },
    {
        timestamps: true
    });

const payoutModel = mongoose.model("Payout", payoutSchema);

export default payoutModel;