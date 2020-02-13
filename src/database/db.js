const mongoose = require("mongoose");

const mongoURL = "mongodb://127.0.0.1:27017/bitflix-api";

try {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    console.log("Connected to mongoDB!");
} catch (error) {
    console.log("MongoDB connection failed");
    console.log(error);
}
