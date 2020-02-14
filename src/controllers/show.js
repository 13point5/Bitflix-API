const express = require("express");
const Show = require("../models/show");
const auth = require("../middleware/auth");

const router = new express.Router();

// Add a new show
router.post("/new", auth, async (req, res) => {
    try {
        const show = new Show({
            ...req.body,
            owner: req.user._id
        });
        await show.save();
        res.status(201).send(show);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

// Get all shows
router.get("/all", auth, async (req, res) => {
    try {
        const shows = await Show.find({ owner: req.user._id });
        res.send(shows);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get show by id
router.get("/:id", auth, async (req, res) => {
    try {
        const show = await Show.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!show) {
            return res.status(404).send({ error: "Show not found" });
        }

        res.send(show);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a show
router.patch("/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed = ["season", "episode"];
    const isValid = updates.every(update => allowed.includes(update));

    if (!isValid) {
        return res.status(400).send({ error: "Invalid update methods" });
    }

    try {
        const show = await Show.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!show) {
            return res.status(404).send({ error: "Show not found" });
        }

        updates.forEach(update => (show[update] = req.body[update]));
        await show.save();
        res.send(show);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete show by id
router.delete("/:id", auth, async (req, res) => {
    try {
        const show = await Show.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!show) {
            return res.status(404).send({ error: "Show not found" });
        }

        res.send(show);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
