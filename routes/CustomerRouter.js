const { db_Select, db_Insert } = require("../module/MasterModule");

const CustRouter = require("express").Router(),
  dateFormat = require("dateformat");

CustRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});

const cust_list = (comp_id, id = 0) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_customer",
      whr = `comp_id = ${comp_id} ${id > 0 ? `AND cust_id = ${id}` : ''}`,
      order = null;
    var res_dt = await db_Select(select, table_name, whr, order);
    resolve(res_dt);
  });
};

CustRouter.get("/list", async (req, res) => {
  var comp_id = req.session.user.comp_id;
  var comp_dtls = await cust_list(comp_id);
  var res_dt = {
    data: comp_dtls.suc > 0 ? comp_dtls.msg : [],
  };
  res.render("customer/view", res_dt);
});

CustRouter.get("/add", async (req, res) => {
  var comp_id = req.session.user.comp_id,
    data = req.query,
    cust_dtls = [];
  if (data.id > 0) {
    cust_dtls = await cust_list(comp_id, data.id);
  }

  var res_dt = {
    id: data.id,
    data: cust_dtls.suc > 0 ? cust_dtls.msg : [],
    dateFormat,
  };
  res.render("customer/edit", res_dt);
});

CustRouter.post("/save", async (req, res) => {
  var data = req.body,
    comp_id = req.session.user.comp_id,
    dateTime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    user_name = req.session.user.user_name;
  var table_name = "md_customer",
    fields =
      data.id > 0
        ? `cust_name = '${data.cust_name}', phone_no = '${data.phone_no}', bill_address = '${data.bill_address}', delivery_address = '${data.delivery_address}', email_id = '${data.email_id}', pay_mode = '${data.pay_mode}', date_of_birth = '${data.date_of_birth}', gender = '${data.gender}', modified_by = '${user_name}', modified_dt = '${dateTime}'`
        : "(comp_id, cust_name, phone_no, bill_address, delivery_address, email_id, pay_mode, date_of_birth, gender, created_by, created_dt)",
    values = `(${comp_id}, '${data.cust_name}', '${data.phone_no}', '${data.bill_address}', '${data.delivery_address}', '${data.email_id}', '${data.pay_mode}', '${data.date_of_birth}', '${data.gender}', '${user_name}', '${dateTime}')`,
    whr = data.id > 0 ? `cust_id = ${data.id}` : null,
    flag = data.id > 0 ? 1 : 0;
  var res_dt = await db_Insert(table_name, fields, values, whr, flag);
  if (res_dt.suc > 0) {
    req.session.message = {
      type: "success",
      message: `${data.id > 0 ? "Updated" : "Saved"} successfully`,
    };
  } else {
    req.session.message = {
      type: "danger",
      message: res_dt.msg,
    };
  }
  res.redirect("/customer/list");
});

module.exports = { CustRouter };
