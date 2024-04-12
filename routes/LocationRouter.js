const express = require("express");
const { location_list, add_location, edit_location, loc_edit_dtls } = require("../module/LocationModule");
const LocationRouter = express.Router();

LocationRouter.use((req, res, next) => {
    var user = req.session.user;
    console.log(user,'555');
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });

LocationRouter.get("/location_dtls", async (req, res) => {
    // var comp_id = req.session.user.comp_id;
    // console.log(comp_id);
    var locations = await location_list();
    var res_dt = {
      data: locations.suc > 0 ? locations.msg : []
    };
    console.log(data,'777')
    res.render("location/location", res_dt);
  });

LocationRouter.get("/add_location", async (req, res) => {
       res.render("location/add_location");
  });  

LocationRouter.post('/add_new_location', async (req, res) => {
    var data = req.body;
    var user_id = req.session.user.user_id
    console.log(data,"maaaaaa");
  var loc_data = await add_location(data,user_id);
  res.redirect("/location/location_dtls");
  });

// LocationRouter.get('/add_edit_dtls', async (req, res) => {
//     var data = req.query;
//     var user_id = req.session.user.user_id;
//     // console.log(data,"lalal");
//     var loc_dtl = await location_list();
//     var loc_edit_dtl = await edit_location(data.sl_no)
//     // console.log(item_dtl);
//     var res_dt = {
//       loc_dt: loc_dtl.suc > 0 ? loc_dtl.msg : [],
//       loc_edit_dt: loc_edit_dtl.suc > 0 ? loc_edit_dtl.msg : [],
//       sl_no: data.sl_no,
//     }
//     res.render("location/location_dtls", res_dt);
//   });

LocationRouter.get("/edit_location", async (req, res) => {
  var data = req.query;
  console.log(data);
  var loc_edit = await loc_edit_dtls(data);
  var res_dt = {
    data: loc_edit.suc > 0 ? loc_edit.msg : [],
    sl_no: data.sl_no
  };
  console.log(data,'999')
    res.render("location/edit_location",res_dt);
}); 

LocationRouter.post('/edit_new_location', async (req, res) => {
    var data = req.body;
    var user_id = req.session.user.user_id
    console.log(data,"maaaaaa");
  var loc_data = await edit_location(data,user_id);
  console.log(loc_data);
  res.redirect("/location/location_dtls");
  });

module.exports = { LocationRouter };

