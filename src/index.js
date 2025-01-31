require("dotenv").config();

const express = require("express");
const cors = require("cors");
const userController = require("./controllers/user");
const showController = require("./controllers/show");

require("./database/db");

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        credentials: true
    })
);
app.use(express.json());
app.use("/api/user/", userController);
app.use("/api/show/", showController);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
