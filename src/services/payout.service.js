import payoutModel from "../models/payout.model.js";
import saleModel from "../models/sale.model.js";
import userModel from "../models/user.model.js";

const ADVANCE_PERCENTAGE = 10;

export const runAdvancePayoutService = async () => {

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

export const reconcileSaleService = async (saleId, status) => {

    try {
        const sale = await saleModel.findById(saleId);

        if (!sale) {
            throw new Error("Sale not found");
        }

        if (sale.isSettled) {
            throw new Error("Sale already reconciled");
        }

        if (!["APPROVED", "REJECTED"].includes(status)) {
            throw new Error("Invalid status");
        }

        if (status === "APPROVED") {

            const remainingAmount =
                sale.earning - sale.advanceAmount;

            await payoutModel.create({
                userId: sale.userId,
                saleId: sale._id,
                amount: remainingAmount,
                type: "FINAL",
                status: "SUCCESS"
            });

            await userModel.findByIdAndUpdate(
                sale.userId,
                {
                    $inc: {
                        withdrawableBalance: remainingAmount
                    }
                }
            );

            const updatedSale = await saleModel.findByIdAndUpdate(
                sale._id,
                {
                    status: "APPROVED",
                    isSettled: true
                }, { new: true }
            );

            return updatedSale;
        }
        else {

            const deduction = sale.advanceAmount;

            await payoutModel.create({
                userId: sale.userId,
                saleId: sale._id,
                amount: -deduction,
                type: "ADJUSTMENT",
                status: "SUCCESS"
            });

            await userModel.findByIdAndUpdate(
                sale.userId,
                {
                    $inc: {
                        withdrawableBalance: -deduction
                    }
                }
            );

            const updatedSale = await saleModel.findByIdAndUpdate(
                sale._id,
                {
                    status: "REJECTED",
                    isSettled: true
                }, { new: true }
            );

            return updatedSale;

        }

    } catch (err) {
        throw new Error(err.message);
    }

}