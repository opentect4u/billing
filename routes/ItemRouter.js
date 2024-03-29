const express = require("express");
const { item_lt,item_edit_dtls, item_list_id, item_list, save_edit_item_data, save_add_item_data, getStockList, save_item_stock } = require("../module/ItemModule");
const { getUnitList } = require("../module/UnitModule");
const ItemRouter = express.Router();

ItemRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});

// ITEM SEARCH BY WORDS //
// ItemRouter.get("/items_details", async (req, res) => {
//   var comp_id = req.session.user.comp_id;
//   // console.log(comp_id);
//   var item_list = await item_lt(comp_id);
//   console.log(item_list);
//   var res_dt = {
//     data: item_list.suc > 0 ? item_list.msg : [],
//   };
//   res.render("items/items_details", res_dt);
// });

ItemRouter.get("/items_details", async (req, res) => {
  var comp_id = req.session.user.comp_id;
  // console.log(comp_id);
  var items = await item_list(comp_id);
  var res_dt = {
    data: items.suc > 0 ? items.msg : []
  };
  res.render("items/view", res_dt);
});

ItemRouter.get('/item_list', async (req, res) => {
  var comp_id = req.session.user.comp_id;
  var keyword = req.query.keyword
  var item_list = await item_lt(comp_id, keyword);
  // console.log(item_list);
  res.send(item_list)
})

ItemRouter.get('/item_name_list', async (req, res) => {
  var data = req.query;
  // console.log(data,"1234");
  var item = await item_list_id(data.id);
  // console.log(item);
  res.send(item)
})

ItemRouter.get('/add_edit_dtls', async (req, res) => {
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  // console.log(data,"lalal");
  var item_dtl = await item_list(comp_id),
  unit_dt = await getUnitList(comp_id);
  var item_edit_dtl = await item_edit_dtls(data.id)
  // console.log(item_dtl);
  var res_dt = {
    item_dt: item_dtl.suc > 0 ? item_dtl.msg : [],
    item_edit_dt: item_edit_dtl.suc > 0 ? item_edit_dtl.msg : [],
    unit_dt: unit_dt.suc > 0 ? unit_dt.msg : [],
    id: data.id,
  }
  res.render("items/edit_item_dtls", res_dt);
});

ItemRouter.post('/save_edit_data', async (req, res) => {
  var data = req.body;
  // console.log(data,"maaaaaa");
var edit_data = await save_edit_item_data(data);
res.redirect("/items/items_details")
});

ItemRouter.get("/add_dtls", async (req, res) =>{
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  var item_dtl = await item_list(comp_id),
  unit_dt = await getUnitList(comp_id);
 var res_dt = {
  data: item_dtl.suc > 0 ? item_dtl.msg : [],
  unit_dt: unit_dt.suc > 0 ? unit_dt.msg : [],
 }
  res.render("items/add_item_dtls",res_dt);
});

ItemRouter.post("/save_data", async (req, res) => {
  var data = req.body;
  // console.log(data,"lalal");
  comp_id = req.session.user.comp_id
  var add_data = await save_add_item_data(data,comp_id);
  res.redirect("/items/items_details")
});

ItemRouter.get('/stock', async (req, res) => {
  var comp_id = req.session.user.comp_id, 
  br_id = req.session.user.br_id;
  // console.log(comp_id);
  var items = await getStockList(comp_id, br_id);
  var res_dt = {
    data: items.suc > 0 ? items.msg : []
  };
  res.render("stock/view", res_dt);
})

ItemRouter.get("/add_stock", async (req, res) =>{
  var data = req.query;
  var comp_id = req.session.user.comp_id,
  br_id = req.session.user.br_id;
  var item_dt = await item_list(comp_id),
  stock_dt = [];
  if(data.item_id > 0){
    stock_dt = await getStockList(comp_id, br_id, data.item_id)
  }
 var res_dt = {
  id: data.item_id,
  item: item_dt.suc > 0 ? item_dt.msg : [],
  data: stock_dt.suc > 0 ? stock_dt.msg : [],
 }
  res.render("stock/add_stock",res_dt);
});

ItemRouter.post('/save_item_stock', async (req, res) => {
  var data = req.body;
  // console.log(data,"lalal");
  var comp_id = req.session.user.comp_id,
  br_id = req.session.user.br_id,
  user_name = req.session.user.user_name;
  var add_data = await save_item_stock(comp_id, br_id, user_name, data);
  res.redirect("/items/stock")
})

module.exports = { ItemRouter };
