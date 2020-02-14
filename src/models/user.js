const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Show = require("./show");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// Connect shows with a user
userSchema.virtual("shows", {
    ref: "Show",
    localField: "_id",
    foreignField: "owner"
});

// Hide private details of user
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Could not sign in");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Could not sign in");

    return user;
};

// Generate JWT
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "coolproject");

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// Hashing password
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 9);
    }
    next();
});

// Delete users' shows when user is deleted
userSchema.pre("remove", async function(next) {
    const user = this;
    await Show.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
