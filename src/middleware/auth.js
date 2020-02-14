const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            token = req.body.headers.Authorization;
        }
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, "coolproject");
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token
        });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        console.log(req.body);
        console.log(req.header("Authorization"));
        console.log(e);
        res.status(401).send({ error: "Please authenticate." });
    }
};

module.exports = auth;
