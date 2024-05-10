const express = require("express");
const{ supplier_lt, supplier_list, save_add_sup_data, save_edit_sup_data, sup_edit_dtls, sup_list_id, save_add_purchase_data, br_list } = require("../module/PurchaseModule");
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
  });

PurchaseRouter.get('/sup_name_list', async (req, res) => {
    var data = req.query;
    // console.log(data,"1234");
    var item = await sup_list_id(data.id);
    // console.log(item);
    res.send(item)
  })

PurchaseRouter.get('/add_edit_dtls', async (req, res) => {
    var data = req.query;
    var comp_id = req.session.user.comp_id;
    // console.log(data,"lalal");
    var sup_dtl = await supplier_list(comp_id),
    unit_dt = await getUnitList(comp_id);
    var sup_edit_dtl = await sup_edit_dtls(data.id)
    // console.log(item_dtl);
    var res_dt = {
      sup_dt: sup_dtl.suc > 0 ? sup_dtl.msg : [],
      sup_edit_dt: sup_edit_dtl.suc > 0 ? sup_edit_dtl.msg : [],
      unit_dt: unit_dt.suc > 0 ? unit_dt.msg : [],
      id: data.id,
    }
    res.render("purchase/edit_sup_dtls", res_dt);
  });

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

PurchaseRouter.post('/save_edit_data', async (req, res) => {
    var data = req.body;
    // console.log(data,"maaaaaa");
  var edit_data = await save_edit_sup_data(data);
  // console.log(edit_data);
  res.redirect("/purchase/supplier_details")
  });

PurchaseRouter.post("/save_data", async (req, res) => {
    var data = req.body;
    // console.log(data,"lalal");
    comp_id = req.session.user.comp_id
    var add_data = await save_add_sup_data(data,comp_id);
    res.redirect("/purchase/supplier_details")
  });

  PurchaseRouter.post("/purchase_info", async (req, res) => {
    res.redirect("/purchase/purchase_info")
  });

// ==============================================================================================
PurchaseRouter.get("/brn_list", async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await br_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("purchase/purchase_info", res_dt);
});

PurchaseRouter.post("/save_purchase_data", async (req, res) => {
  var data = req.body;
  // console.log(data,"lalal");
  comp_id = req.session.user.comp_id
  var add_data = await save_add_purchase_data(data,comp_id);
  res.redirect("/purchase/purchase_info")
});

module.exports = { PurchaseRouter };