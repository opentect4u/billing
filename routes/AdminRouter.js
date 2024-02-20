const express = require("express");
const { db_Select } = require("../module/MasterModule");
AdminRouter = express.Router();
bcrypt = require("bcrypt");

AdminRouter.post("/admin_login", async (req, res) => {
  var data = req.body,
    result;
  console.log(data);
  var select = "a.*,b.*",
    table_name = "md_user a , md_company b",
    whr = `a.comp_id=b.id AND a.email_id='${data.email_id}' AND a.user_type='A'`,
    order = null;
  var res_dt = await db_Select(select, table_name, whr, order);
  if (res_dt.suc > 0) {
    if (res_dt.msg.length > 0) {
      // console.log(await bcrypt.compare(data.password, res_dt.msg[0].password));
      if (await bcrypt.compare(data.password, res_dt.msg[0].password)) {
        req.session.user = res_dt.msg[0];
        res.redirect("/report/location_report");
      } else {
        result = {
          suc: 0,
          msg: "Please check your userid or password",
          dt: res_dt
        };
        res.send(result)
        // res.redirect("/login");
      }
    } else {
      result = { suc: 0, msg: "No data found", dt: res_dt };
      res.send(result)
      // res.redirect("/login");
    }
  } else {
    result = { suc: 0, msg: res_dt.msg, dt: res_dt };
    res.send(result)
    // res.redirect("/login");
  }
});

AdminRouter.get("/logout", (req, res) => {
  // req.session.destroy();
  res.redirect("/login");
});

module.exports = { AdminRouter };
