import payoutModel from "../models/payout.model.js";
import saleModel from "../models/sale.model.js";
import userModel from "../models/user.model.js";

const ADVANCE_PERCENTAGE = 10;

const runAdvancePayout = async () => {

    try {
        const sales = await saleModel.find({
            status: "PENDING",
            advancePaid: false
        });

        if (!sales.length) {
            return {
                processed: 0,
                totalAdvancePaid: 0
            };
        }

        let processed = 0;
        let totalAdvancePaid = 0;

        for (const sale of sales) {

            try {
                const advanceAmount =
                    ((sale.earning * ADVANCE_PERCENTAGE) / 100).toFixed(2);

                await payoutModel.create({
                    userId: sale.userId,
                    saleId: sale._id,
                    amount: advanceAmount,
                    type: "ADVANCE",
                    status: "SUCCESS"
                });

                await userModel.findByIdAndUpdate(
                    sale.userId,
                    {
                        $inc: {
                            withdrawableBalance: advanceAmount
                        }
                    }
                );

                if (!user) {
                    throw new Error("User not found");
                }

                await saleModel.findByIdAndUpdate(
                    sale._id,
                    {
                        advancePaid: true,
                        advanceAmount
                    }
                );

                processed++;

                totalAdvancePaid += advanceAmount;
            } catch (err) {
                console.error(`Failed sale ${sale._id}`, err);
            }
        }

        return {
            processed,
            totalAdvancePaid
        };
    } catch (err) {
        throw new Error(err.message);
    }

};

export { runAdvancePayout };