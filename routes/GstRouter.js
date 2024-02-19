const express = require('express');
const { branch_list, getGSTstatement, comp_header, getGstSummary } = require('../module/GstModule');
const GstRouter = express.Router();
dateFormat = require("dateformat");

GstRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });

GstRouter.get('/gst_statement', async (req, res) => {
  comp_id = req.session.user.comp_id
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  };
 res.render('gst/gst_statement',res_dt);
});

GstRouter.post('/save_gst_statement', async (req, res) =>{
    var data = req.body;
    // console.log(data);
    comp_id = req.session.user.comp_id
    // console.log(comp_id);
    var res_dt = await getGSTstatement(data,comp_id);
    var comp_dtls = await comp_header();
    // console.log(res_dt,comp_dtls);
    var viewData = {
        frm_dt: data.date_from,
        to_dt: data.date_to,
        brn_name: data.brn_name,
        data: res_dt.suc > 0 ? res_dt.msg : [],
        dateFormat,
        comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    };
    res.render('gst/gst_statement_final',viewData)
});

GstRouter.get('/gst_summary', async (req, res) => {
  comp_id = req.session.user.comp_id;
  var brn_list = await branch_list(comp_id);
  var res_dt = {
    data: brn_list.suc > 0 ? brn_list.msg : [],
  }
res.render('gst/gst_summary',res_dt);
});

GstRouter.post('/save_gst_summary_report', async (req, res) =>{
    var data = req.body;
    // console.log(data);
   comp_id = req.session.user.comp_id;
//    console.log(comp_id);
   var res_dt = await getGstSummary(data,comp_id);
   var comp_dtls = await comp_header();
//    console.log(res_dt,comp_dtls);
   var viewData = {
    frm_dt: data.date_from,
    to_dt: data.date_to,
    brn_name: data.brn_name,
    data: res_dt.suc > 0 ? res_dt.msg : [],
    dateFormat,
    comp_dt: comp_dtls.suc > 0 ? comp_dtls.msg : [],
   };
   res.render('gst/gst_summary_report_final',viewData)
});

module.exports = { GstRouter }