const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

// Sign up a new user
router.post("/signUp", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Sign up a new user
router.post("/signIn", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get user by id
router.get("/me", auth, async (req, res) => {
    res.send(req.user);
});

// Update a user
router.patch("/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ["name", "email", "password"];
    const isValid = updates.every(update => {
        return allowed.includes(update);
    });

    if (!isValid) {
        return res.status(400).send({ error: "Invalid update methods" });
    }

    try {
        const user = req.user;
        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Delete user by id
router.delete("/me", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.send(user);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
