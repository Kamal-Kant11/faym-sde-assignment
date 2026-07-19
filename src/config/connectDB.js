import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log("DB Connected successfully");
    } catch (err) {
        console.log("DB connection Error: ", err.message);
        process.exit(1);
    }
};

export default connectDB;