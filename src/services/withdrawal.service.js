import userModel from "../models/user.model.js";
import withdrawalModel from "../models/withdrawal.model.js";

const createWithdrawal = async (userId, amount) => {
    try {

        const user = await userModel.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.withdrawableBalance < amount) {
            throw new Error("Insufficient balance");
        }

        const now = new Date();

        if (user.lastWithdrawalAt) {

            const DAY = 24 * 60 * 60 * 1000;

            const diff = now - user.lastWithdrawalAt;

            if (diff < DAY) {
                throw new Error("Only one withdrawal every 24 hours.");
            }
        }

        await userModel.findByIdAndUpdate(
            userId,
            {
                $inc: {
                    withdrawableBalance: -amount
                },
                lastWithdrawalAt: now
            }
        );

        const withdrawal =
            await withdrawalModel.create({
                userId,
                amount,
                status: "PENDING"
            });

        return withdrawal;

    } catch (err) {
        throw new Error(err.message);
    }
}

const failWithdrawal = async (withdrawalId) => {

    try {
        const withdrawal = await withdrawalModel.findById(withdrawalId);

        if (!withdrawal) {
            throw new Error("Withdrawal not found");
        }

        if (withdrawal.status === "FAILED") {
            throw new Error("Already failed");
        }

        await userModel.findByIdAndUpdate(
            withdrawal.userId,
            {
                $inc: {
                    withdrawableBalance: withdrawal.amount
                }
            }
        );

        withdrawal.status = "FAILED";
        await withdrawal.save();

        return withdrawal;
    } catch (err) {
        throw new Error(err.message);
    }
}

export { createWithdrawal, failWithdrawal }