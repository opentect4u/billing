const express = require('express');
UserRouter = express.Router();

UserRouter.get("/dashboard", async (req, res) => {
    res.render("dashboard/dashboard");
})

module.exports = {UserRouter}