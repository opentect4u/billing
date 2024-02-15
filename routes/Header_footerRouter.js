const express = require('express');
const Header_footerRouter = express.Router();

Header_footerRouter.get('/get_header_footer',async(req, res) =>{
    res.render("header_footer/header_footer");
})

module.exports = { Header_footerRouter }