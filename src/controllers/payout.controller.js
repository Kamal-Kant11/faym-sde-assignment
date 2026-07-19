import {} from "../services/payout.service.js"

export const runAdvancePayout = async (req, res) => {
    try {

        const result = await payoutService.runAdvancePayout();

        res.status(200).json({
            success: true,
            message: "Advance payout completed",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
