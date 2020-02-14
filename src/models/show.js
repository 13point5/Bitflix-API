const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    season: {
        type: Number
    },
    episode: {
        type: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
