const { db_Select } = require("./MasterModule");

const branch_list = () => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_branch",
      where = null;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const getSaleReport = (data) => {
  return new Promise(async (resolve, reject) => {
    if (data.brn_id > 0) {
      var select =
          "a.receipt_no,a.trn_date,a.qty,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,b.amount,b.pay_mode, c.branch_name",
        table_name = "td_item_sale a, td_receipt b, md_branch c",
        where = `a.receipt_no = b.receipt_no AND a.comp_id = c.comp_id AND a.br_id=c.id AND a.br_id = ${data.brn_id}`;
      var res_dt = await db_Select(select, table_name, where, null);
      resolve(res_dt);
    } else {
      var select =
          "a.receipt_no,a.trn_date,a.qty,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,b.amount,b.pay_mode, c.branch_name",
        table_name = "td_item_sale a, td_receipt b, md_branch c",
        where = `a.receipt_no = b.receipt_no AND a.comp_id = c.comp_id AND a.br_id=c.id`;
      order = "ORDER BY a.br_id";
      var res_dt_2 = await db_Select(select, table_name, where, order);
      resolve(res_dt_2);
    }
  });
};

const payment_mode = () =>{
 return new Promise( async (resolve, reject) => {
  var select = "*",
  table_name = "td_receipt",
  where = null;
  var pay_dt = await db_Select(select,table_name,where,null);
  resolve(pay_dt);
 });
};

const getPayReport = (data) => {
  return new Promise (async (resolve, reject) => {
    var select = "*",
    table_name = "td_receipt",
    where = `pay_mode = '${data.pay_id}'`;
    var res_dt = await db_Select(select,table_name,where,null);
    resolve(res_dt)
  })
}

const item_list = () => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_items",
      where = null;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const getSaleItemReport = (data) => {
return new Promise (async (resolve, reject) => {
  if (data.brn_id > 0) {
    var select = "a.receipt_no,a.trn_date,a.qty,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,b.amount,b.pay_mode,c.item_name,d.branch_name",
    table_name = "td_item_sale a, td_receipt b, md_items c, md_branch d",
    where = `a.receipt_no = b.receipt_no AND a.comp_id = c.com_id AND a.comp_id = d.comp_id AND a.br_id = d.id
    AND a.item_id = c.id AND a.br_id = ${data.brn_id} AND a.item_id = ${data.item_id}`;
    var res_dt = await db_Select(select,table_name,where,null);
    resolve(res_dt)
  }else {
    var select = "a.receipt_no,a.trn_date,a.qty,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,b.amount,b.pay_mode,c.item_name,d.branch_name",
    table_name = "td_item_sale a, td_receipt b, md_items c, md_branch d",
    where = `a.receipt_no = b.receipt_no AND a.comp_id = c.com_id AND a.comp_id = d.comp_id AND a.br_id = d.id
    AND a.item_id = c.id AND a.item_id = ${data.item_id}`;
    order = "ORDER BY a.br_id";
    var res_dt2 = await db_Select(select,table_name,where,order);
    resolve(res_dt2)
  }
});
};

const receipt_list = (frm_dt, to_dt) => {
  return new Promise (async (resolve, reject) => {
    var select = "receipt_no,trn_dt",
    table_name = "td_receipt",
    where = `trn_dt BETWEEN '${frm_dt}' AND '${to_dt}'`;
    var rec_dt = await db_Select(select, table_name, where, null);
    resolve(rec_dt)
  });
};

module.exports = { branch_list, getSaleReport, payment_mode, getPayReport, item_list, getSaleItemReport, receipt_list };
