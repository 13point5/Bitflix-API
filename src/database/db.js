const mongoose = require("mongoose");

const mongoURL = process.env.MONGODB_URL;

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
