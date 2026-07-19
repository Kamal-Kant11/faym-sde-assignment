import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        withdrawableBalance: {
            type: Number,
            default: 0
        },

        lastWithdrawalAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    });

const userModel = mongoose.model("User", userSchema);

export default userModel;