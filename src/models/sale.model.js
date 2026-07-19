import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        brand: {
            type: String,
            required: true,
            trim: true,
        },

        earning: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
        },

        advancePaid: {
            type: Boolean,
            default: false,
        },

        advanceAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        isSettled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const saleModel = mongoose.model("Sale", saleSchema);

export default saleModel;