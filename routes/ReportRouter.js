const express = require("express");
const { branch_list, getSaleReport, payment_mode, getPayReport, item_list, getSaleItemReport, receipt_list, comp_header, user_list } = require("../module/ReportModule");
const { pay_mode, db_Select } = require("../module/MasterModule");
const ReportRouter = express.Router(),
  dateFormat = require("dateformat");

// ReportRouter.use((req, res, next) => {
//   var user = req.session.user;
//   if (!user) {
//     res.redirect("/login");
//   } else {
//     next();
//   }
// });

ReportRouter.get("/location_report", async (req, res) => {
  var brn_list = await branch_list();
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/location_report", res_dt);
});

ReportRouter.post("/location_report", async (req, res) => {
  var data = req.body;
  console.log(data, "123");
  var res_dt = await getSaleReport(data)
  var comp_dtls = await comp_header();
  console.log(res_dt);
  // console.log(comp_dtls);
  var viewData = {
    frm_dt: data.from_date,
    to_dt: data.to_date,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    dateFormat,
    br_narration:
      data.brn_id > 0
        ? res_dt.suc > 0
          ? res_dt.msg.length > 0
            ? `${res_dt.msg[0].branch_name}`
            : ""
          : ""
        : "All Location",
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [], 
  };
  res.render("report/sale_report_final", viewData);
});


ReportRouter.get("/collection_report", async(req, res) => {
  var brn_list = await branch_list();
  var res_dt = {
    brn_data : brn_list.suc > 0 ? brn_list.msg : [],
  };
  res.render("report/collection_report", res_dt)
  // console.log(data);
});

ReportRouter.get("/getuserlist", async (req, res) => {
  var data= req.query;
  var user_dt = await user_list(data.brn_id);
  res.send(user_dt)
})

ReportRouter.post("/collection_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var res_dt = await getPayReport(data);
  var comp_dtls = await comp_header();
  // console.log(res_dt,"collection");
  var viewData = {
    frm_dt: data.date_from,
    to_dt: data.date_to,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    dateFormat,
    pay_mode: pay_mode,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [], 
  };
  res.render("report/collection_report_final", viewData);
});

ReportRouter.get("/itemwise_report", async (req, res) => {
  var brn_list = await branch_list();
  var item_lt = await item_list();
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
    data_item: item_lt.suc > 0 ? item_lt.msg : [],
  };
res.render("report/itemwise_sale_report",res_dt);
});

ReportRouter.post("/itemwise_report_final", async (req, res) => {
  var data = req.body;
  // console.log(data);
  var res_dt = await getSaleItemReport(data);
  // console.log(res_dt);
  var viewData = {
    from_dt: data.from_dt,
    to_dt: data.to_dt,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    br_narration:
      data.brn_id > 0
        ? res_dt.suc > 0
          ? res_dt.msg.length > 0
            ? `${res_dt.msg[0].branch_name} Branch`
            : ""
          : ""
        : "All Branches",
    dateFormat,
    pay_mode: pay_mode
  };
  res.render("report/itemwise_sale_report_final", viewData)
  });

  ReportRouter.get("/receiptwise_report", async(req, res) => {
    res.render("report/receipt_report")
  });

  ReportRouter.post("/receipt_list", async (req, res) => {
    var data = req.body;
    // console.log(data,"1234");
    var res_dt = await receipt_list(data);
    res.send(res_dt);
    // console.log(res_dt);
  });

  ReportRouter.get("/receiptwise_report_final", async(req, res) => {
    res.render("report/receipt_report_final")
  });

module.exports = { ReportRouter };
