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
  stock_list,
  cancelbill_list,
  PayModeReport,
  pay_list,
  receipt_list_by_phone,
  receipt_list_by_item,
  item_list_section,
  Refund_bill_report,
  credit_bill_report,
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
  var comp_dtls = await comp_header(comp_id);
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
  user_name = req.session.user.user_name
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

ReportRouter.get("/getpaylist", async (req, res) => {
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  console.log(data,comp_id);
  var pay_dt = await pay_list(data.brn_id,comp_id);
  res.send(pay_dt);
});

ReportRouter.post("/collection_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var comp_id = req.session.user.comp_id;
  var res_dt = await getPayReport(data, comp_id);
  var comp_dtls = await comp_header(comp_id);
  // console.log(comp_dtls,"collection");
  var viewData = {
    frm_dt: data.date_from,
    to_dt: data.date_to,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    user_id: data.user_id,
    user_name: data.user_name,
    brn_name: data.brn_name,
    dateFormat,
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
  };
  console.log(viewData,"yyyyy")
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
  var comp_dtls = await comp_header(comp_id);
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
  var data = req.body,
  comp_id = req.session.user.comp_id;
  // console.log(data,"1234");
  var res_dt = await receipt_list(data, comp_id);
  res.send(res_dt);
  // console.log(res_dt);
});

ReportRouter.get("/receiptwise_report_final", async (req, res) => {
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  // console.log(data, "lalal");
  var comp_dtls = await comp_header(comp_id);
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

// ReportRouter.get('/user_sale', async (req, res) =>{
//   res.render('report/user_sale');
// });

ReportRouter.get('/user_sale', async (req, res) =>{
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    brn_data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  console.log(res_dt);
  res.render('report/user_sale',res_dt);
});


// ReportRouter.post('/user_list', async (req, res) =>{
//   var data = req.body;
//   var comp_id = req.session.user.comp_id;
//   var res_dt = await user_wise_list(data,comp_id);
//   // var viewData = {
//   //   data: res_dt.suc > 0 ? res_dt.msg : [],
//   // }
//   res.send(res_dt)
// })

ReportRouter.post('/user_list', async (req, res) =>{
  var data = req.body;
  // console.log(data,'p');
  var comp_id = req.session.user.comp_id;
  var res_dt = await user_wise_list(data,comp_id);
  var comp_dtls = await comp_header(comp_id);
  // console.log(comp_dtls,"collection");
  var viewData = {
    frm_dt: data.date_from,
    to_dt: data.date_to,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    user_id: data.user_name,
    brn_name: data.brn_name,
    dateFormat,
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
  };
  // console.log(viewData,'99');
  res.render('report/user_sale_final',viewData)
})


ReportRouter.get("/stock_report", async (req, res) => {
  var comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/stock_report",res_dt);
});

ReportRouter.post("/stock_report", async (req, res) => {
  var comp_id = req.session.user.comp_id
  var comp_dtls = await comp_header(comp_id);
  var br_id = req.body.brn_id
  var all_stock_list = await stock_list(comp_id,br_id);
  console.log(all_stock_list);
  var res_dt = {
    brn_name: req.body.brn_name,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    data: all_stock_list.suc > 0 ? all_stock_list.msg : [],
  };
  res.render("report/stock_report_final",res_dt);
});

ReportRouter.get("/cancelbill_report", async (req, res) => {
  var comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/cancel_bill_report",res_dt);
});

ReportRouter.post("/cancelbill_report", async (req, res) => {
  var data = req.body;
  var comp_id = req.session.user.comp_id
  var comp_dtls = await comp_header(comp_id);
  var br_id = req.body.brn_id
  var all_cancelbill_list = await cancelbill_list(data,comp_id,br_id);
  console.log(all_cancelbill_list, data);
  var res_dt = {
    from_dt: data.from_dt,
    to_dt: data.to_dt,
    brn_name: req.body.brn_name,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    data: all_cancelbill_list.suc > 0 ? all_cancelbill_list.msg : [],
  };
  res.render("report/cancel_bill_report_final",res_dt);
});

ReportRouter.get("/paymode_report", async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    brn_data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/paymode_report", res_dt);
  // console.log(data);
});

ReportRouter.post("/paymode_report_final", async (req, res) => {
  var data = req.body;
  console.log(data);
  var comp_id = req.session.user.comp_id;
  var res_dt = await PayModeReport(data, comp_id);
  var comp_dtls = await comp_header(comp_id);
  // console.log(comp_dtls,"collection");
  var viewData = {
    frm_dt: data.date_from,
    to_dt: data.date_to,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    user_id: data.user_id,
    brn_name: data.brn_name,
    dateFormat,
    pay_mode: data.pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
  };
  res.render("report/paymode_report_final", viewData);
});

ReportRouter.get("/srch_by_phone", async (req, res) => {
  res.render("search/search_by_phone");
});

ReportRouter.post("/receipt_list_by_phn", async (req, res) => {
  var data = req.body,
  comp_id = req.session.user.comp_id;
  // console.log(data,"1234");
  var res_dt = await receipt_list_by_phone(data, comp_id);
  res.send(res_dt);
  // console.log(res_dt);
});

ReportRouter.get("/srch_by_phone_final", async (req, res) => {
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  // console.log(data, "lalal");
  var comp_dtls = await comp_header(comp_id);
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
  res.render("search/search_by_phone_final", res_dt);
});

ReportRouter.get("/srch_by_item", async (req, res) => {
  comp_id = req.session.user.comp_id;
  var res_dt = await item_list_section(comp_id)
  var viewData = {
    data: res_dt.suc > 0 ? res_dt.msg : [],
  };
  res.render("search/search_by_item",viewData);
});

ReportRouter.post("/receipt_list_by_itm", async (req, res) => {
  var data = req.body,
  comp_id = req.session.user.comp_id;
  // console.log(data,"1234");
  var res_dt = await receipt_list_by_item(data, comp_id);
  res.send(res_dt);
  // console.log(res_dt);
});

ReportRouter.get("/srch_by_item_final", async (req, res) => {
  var data = req.query;
  var comp_id = req.session.user.comp_id;
  // console.log(data, "lalal");
  var comp_dtls = await comp_header(comp_id);
  var brn_dtls = await branch_list(comp_id);
  var bill_dtls = await rec_bill_dtls(data.receipt_no);
  var bill_item_dtls = await rec_bill_item_dtls(data.receipt_no,null,comp_id);
  // console.log(bill_dtls);
  // console.log(brn_dtls);
  // console.log(bill_item_dtls);
  var res_dt = {
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    brn_dt: brn_dtls.suc > 0 ? brn_dtls.msg : [],
    bill_dt: bill_dtls.suc > 0 ? bill_dtls.msg : [],
    bill_item_dt: bill_item_dtls.suc > 0 ? bill_item_dtls.msg : [],
  };
  res.render("search/search_by_item_final", res_dt);
});

ReportRouter.get("/refund_report", async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/refund_report", res_dt);
});

ReportRouter.post("/refund_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var comp_id = req.session.user.comp_id;
  // console.log(comp_id);
  // console.log(data, "123");
  var res_dt = await Refund_bill_report(data, comp_id);
  var comp_dtls = await comp_header(comp_id);
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
  res.render("report/refund_report_final", viewData);
});

ReportRouter.get("/credit_report", async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/credit_report", res_dt);
});

ReportRouter.post("/credit_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var comp_id = req.session.user.comp_id;
  // console.log(comp_id);
  // console.log(data, "123");
  var res_dt = await credit_bill_report(data, comp_id);
  var comp_dtls = await comp_header(comp_id);
  var sett = await getRecptSet(comp_id);
  // console.log(res_dt);
  // console.log(comp_dtls);
  var viewData = {
    frm_dt: data.from_date,
    to_dt: data.to_date,
    brn_name: data.brn_name,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    dateFormat,
    // pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    sett: sett.suc > 0 && sett.msg.length > 0 ? sett.msg[0] : {},
  };
  res.render("report/credit_report_final", viewData);
});

module.exports = { ReportRouter };
