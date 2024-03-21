const express = require('express');
const { comp_list, settings_details, settings, edit_settings_dtls, save_edit_settings, save_add_settings } = require('../module/SettingsModule');
const SettingsRouter = express.Router();

SettingsRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });

SettingsRouter.get('/settings_details', async (req, res) =>{
  var comp_id = req.session.user.comp_id;
  console.log(req.session.user.comp_id,"data");
  var set_dtls = await settings_details(comp_id);
  console.log(set_dtls);
  var viewData = {
    data: set_dtls.suc > 0 ? set_dtls.msg : [],
  };
  console.log(viewData);
  res.render('settings/settings',viewData);
});

SettingsRouter.get('/edit_settings', async (req, res) =>{
    var data = req.query;
    console.log(data);
    var setting_dtls = await edit_settings_dtls(data);
    var res_dt = {
        settings_dt: setting_dtls.suc > 0 ? setting_dtls.msg : [],
        com_id : data.comp_id,
        discount_type: [{id: 'A',name:'Amount'}, {id: 'P',name:'Percentage'}],
        receipt_type: [{id: 'P', name:'Print'}, {id: 'S', name:'SMS'}, {id: 'B', name:'Both'}]
    };
    // console.log(res_dt);
    res.render('settings/edit_settings',res_dt)
});

SettingsRouter.post("/save_edit_data", async (req, res) => {
    var data = req.body;
    comp_id = req.session.user.comp_id;
    //    console.log(data,"lala");
    //    console.log(comp_id,'la');
    var setting_data = await save_edit_settings(data);
    res.redirect("/settings/settings_details");
  });

  SettingsRouter.get("/add_settings", async (req, res) => {
    var comp_id = req.session.user.comp_id;
    var comp_lt = await comp_list(comp_id);
    var res_dt = {
      data: comp_lt.suc > 0 ? comp_lt.msg : [],
    discount_type: [{id: 'A',name:'Amount'}, {id: 'P',name:'Percentage'}]

    };
    //   console.log(data, "lolo");
    res.render("settings/add_settings", res_dt);
  });

  SettingsRouter.post("/save_add_settings", async (req, res) => {
    var data = req.body;
      console.log(data, "lala");
    var add_settings_data = await save_add_settings(data);
    res.redirect("/settings/settings_details");
  });

module.exports = { SettingsRouter }