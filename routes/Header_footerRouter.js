const express = require("express");
const {
  comp_list,
  show_header_footer_flag,
  save_edit_header_footer,
  save_add_header_footer,
} = require("../module/Header_footerModule");
const Header_footerRouter = express.Router();

Header_footerRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});

Header_footerRouter.get("/get_header_footer", async (req, res) => {
  var comp_id = req.session.user.comp_id;
  var com_list = await comp_list(comp_id);
  var res_dt = {
    com_dt: com_list.suc > 0 ? com_list.msg : [],
    comp_id : comp_id,
  };
  res.render("header_footer/header_footer", res_dt);
});

Header_footerRouter.get("/show_header_footer", async (req, res) => {
  var data = req.query;
  // console.log(data);
  var show_header_footer = await show_header_footer_flag(data);
  res.send(show_header_footer);
});

Header_footerRouter.get("/edit_header_footer", async (req, res) => {
  var data = req.query;
  var show_header_footer_dtls = await show_header_footer_flag(data);
  var res_dt = {
    show_header_footer_dt:
      show_header_footer_dtls.suc > 0 ? show_header_footer_dtls.msg : [],
      com_id : data.comp_id,
  };
  // console.log(res_dt);
  res.render("header_footer/edit_header_footer", res_dt);
});

Header_footerRouter.post("/save_edit_data", async (req, res) => {
  var data = req.body;
  comp_id = req.session.user.comp_id;
    //  console.log(data,"lala");
    //  console.log(comp_id,'la');
  var edit_header_footer_data = await save_edit_header_footer(data);
  // console.log(edit_header_footer_data);
  res.redirect("/header_footer/get_header_footer");
});

Header_footerRouter.get("/add_header_footer", async (req, res) => {
  var comp_id = req.session.user.comp_id;
  var comp_lt = await comp_list(comp_id);
  var res_dt = {
    data: comp_lt.suc > 0 ? comp_lt.msg : [],
  };
  //   console.log(data, "lolo");
  res.render("header_footer/add_header_footer", res_dt);
});

Header_footerRouter.post("/save_add_header_footer", async (req, res) => {
  var data = req.body;
  //   console.log(data, "lala");
  var add_header_footer_data = await save_add_header_footer(data);
  res.redirect("/header_footer/get_header_footer");
});

module.exports = { Header_footerRouter };
