import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    });

const withdrawalModel = mongoose.model("Withdrawal", withdrawalSchema);

export default withdrawalModel;