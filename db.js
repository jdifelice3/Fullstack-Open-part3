const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

const connectDb = async() => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Mongo DB connection error", error);
        process.exit(1);
    }
}

module.exports = connectDb;