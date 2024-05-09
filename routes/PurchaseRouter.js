const express = require("express");
const{ supplier_lt, supplier_list, save_add_sup_data } = require("../module/PurchaseModule");
const{ getUnitList } = require("../module/UnitModule");
const PurchaseRouter = express.Router();

PurchaseRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });

PurchaseRouter.get("/supplier_details", async (req, res) => {
    var comp_id = req.session.user.comp_id;
    // console.log(comp_id);
    var suppliers = await supplier_list(comp_id);
    var res_dt = {
      data: suppliers.suc > 0 ? suppliers.msg : []
    };
    res.render("purchase/supplier_info", res_dt);
  });

PurchaseRouter.get('/supplier_list', async (req, res) => {
    var comp_id = req.session.user.comp_id;
    var keyword = req.query.keyword
    var item_list = await supplier_lt(comp_id, keyword);
    // console.log(item_list);
    res.send(supplier_list)
  })

PurchaseRouter.get("/add_dtls", async (req, res) =>{
    var data = req.query;
    var comp_id = req.session.user.comp_id;
    var sup_dtl = await supplier_list(comp_id),
    unit_dt = await getUnitList(comp_id);
   var res_dt = {
    data: sup_dtl.suc > 0 ? sup_dtl.msg : [],
    unit_dt: unit_dt.suc > 0 ? unit_dt.msg : [],
   }
    res.render("purchase/add_sup_dtls",res_dt);
  });

PurchaseRouter.post("/save_data", async (req, res) => {
    var data = req.body;
    // console.log(data,"lalal");
    comp_id = req.session.user.comp_id
    var add_data = await save_add_sup_data(data,comp_id);
    res.redirect("/purchase/supplier_details")
  });

module.exports = { PurchaseRouter };