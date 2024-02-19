const express = require("express");
const {
  branch_list,
  getSaleReport,
  payment_mode,
  getPayReport,
  item_list,
  getSaleItemReport,
  receipt_list,
  comp_header,
  user_list,
  getRecptSet,
  rec_bill_dtls,
  rec_bill_item_dtls,
  user_wise_list,
} = require("../module/ReportModule");
const { pay_mode, db_Select } = require("../module/MasterModule");
const ReportRouter = express.Router(),
  dateFormat = require("dateformat");

ReportRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});

ReportRouter.get("/location_report", async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/location_report", res_dt);
});

ReportRouter.post("/location_report", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var comp_id = req.session.user.comp_id;
  // console.log(comp_id);
  // console.log(data, "123");
  var res_dt = await getSaleReport(data, comp_id);
  var comp_dtls = await comp_header();
  var sett = await getRecptSet(comp_id);
  // console.log(res_dt);
  // console.log(comp_dtls);
  var viewData = {
    frm_dt: data.from_date,
    to_dt: data.to_date,
    brn_name: data.brn_name,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    dateFormat,
    // br_narration:
    //   data.brn_id > 0
    //     ? res_dt.suc > 0
    //       ? res_dt.msg.length > 0
    //         ? `${res_dt.msg[0].branch_name}`
    //         : ""
    //       : ""
    //     : "All Location",
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    sett: sett.suc > 0 && sett.msg.length > 0 ? sett.msg[0] : {},
  };
  res.render("report/sale_report_final", viewData);
});

ReportRouter.get("/collection_report", async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    brn_data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/collection_report", res_dt);
  // console.log(data);
});

ReportRouter.get("/getuserlist", async (req, res) => {
  var data = req.query;
  var user_dt = await user_list(data.brn_id);
  res.send(user_dt);
});

ReportRouter.post("/collection_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var comp_id = req.session.user.comp_id;
  var res_dt = await getPayReport(data, comp_id);
  var comp_dtls = await comp_header();
  // console.log(comp_dtls,"collection");
  var viewData = {
    frm_dt: data.date_from,
    to_dt: data.date_to,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    user_id: data.user_id,
    brn_name: data.brn_name,
    dateFormat,
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
  };
  res.render("report/collection_report_final", viewData);
});

ReportRouter.get("/itemwise_report", async (req, res) => {
  var comp_id = req.session.user.comp_id;
  var brn_list = await branch_list(comp_id);
  var item_lt = await item_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
    data_item: item_lt.suc > 0 ? item_lt.msg : [],
  };
  res.render("report/itemwise_sale_report", res_dt);
});

ReportRouter.post("/itemwise_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var comp_id = req.session.user.comp_id;
  var res_dt = await getSaleItemReport(data, comp_id);
  var comp_dtls = await comp_header();
  // console.log(res_dt,"rrrr");
  var viewData = {
    from_dt: data.from_dt,
    to_dt: data.to_dt,
    item_name: data.itm_name,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    brn_name: data.brn_name,
    // br_narration:
    //   data.brn_id > 0
    //     ? res_dt.suc > 0
    //       ? res_dt.msg.length > 0
    //         ? `${res_dt.msg[0].branch_name}`
    //         : ""
    //       : ""
    //     : "All Location",
    dateFormat,
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
  };
  // console.log(data);
  res.render("report/itemwise_sale_report_final", viewData);
});

ReportRouter.get("/receiptwise_report", async (req, res) => {
  res.render("report/receipt_report");
});

ReportRouter.post("/receipt_list", async (req, res) => {
  var data = req.body;
  // console.log(data,"1234");
  var res_dt = await receipt_list(data);
  res.send(res_dt);
  // console.log(res_dt);
});

ReportRouter.get("/receiptwise_report_final", async (req, res) => {
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  // console.log(data, "lalal");
  var comp_dtls = await comp_header();
  var brn_dtls = await branch_list(comp_id);
  var bill_dtls = await rec_bill_dtls(data.receipt_no);
  var bill_item_dtls = await rec_bill_item_dtls(data.receipt_no,data.user,comp_id);
  // console.log(bill_dtls);
  // console.log(brn_dtls);
  // console.log(bill_item_dtls);
  var res_dt = {
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    brn_dt: brn_dtls.suc > 0 ? brn_dtls.msg : [],
    bill_dt: bill_dtls.suc > 0 ? bill_dtls.msg : [],
    bill_item_dt: bill_item_dtls.suc > 0 ? bill_item_dtls.msg : [],
  };
  res.render("report/receipt_report_final", res_dt);
});

ReportRouter.get('/user_sale', async (req, res) =>{
  res.render('report/user_sale');
});

ReportRouter.post('/user_list', async (req, res) =>{
  var data = req.body;
  console.log(data);
  var comp_id = req.session.user.comp_id;
  console.log(comp_id);
  var res_dt = await user_wise_list(data,comp_id);
  res.send(res_dt)
})

module.exports = { ReportRouter };
