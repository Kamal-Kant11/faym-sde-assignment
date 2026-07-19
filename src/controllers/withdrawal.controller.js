import { createWithdrawalService, failWithdrawalService } from "../services/withdrawal.service.js";

export const createWithdrawal = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const result = await createWithdrawalService(
            userId,
            amount
        );

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const failWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await failWithdrawalService(id);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};