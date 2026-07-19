import saleModel from "../models/sale.model.js";

export const createSale = async (req, res) => {
    try {

        const sale = await saleModel.create(req.body);

        res.status(201).json({
            success: true,
            data: sale
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};