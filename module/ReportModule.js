const { db_Select } = require("./MasterModule");

const branch_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_branch",
      where = `comp_id = '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const user_list = (brn_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "user_name",
      table_name = "md_user",
      where = `br_id =${brn_id} AND user_type = 'U'`,
      order = null;
    var ul_dt = await db_Select(select, table_name, where, order);
    resolve(ul_dt);
  });
};

const getSaleReport = (data, comp_id) => {
  return new Promise(async (resolve, reject) => {
    if (data.brn_id > 0) {
      var select =
          "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,count(b.receipt_no)no_of_items,sum(a.price)price,sum(a.discount_amt)discount_amt,sum(a.cgst_amt)cgst_amt,sum(a.sgst_amt)sgst_amt,sum(a.round_off)rount_off,sum(a.amount)net_amt,a.created_by",
        table_name = "td_receipt a,td_item_sale b",
        where = `a.receipt_no = b.receipt_no AND a.trn_date BETWEEN '${data.from_date}' AND '${data.to_date}' AND b.comp_id = ${comp_id} AND b.br_id = ${data.brn_id}`;
      order =
        "Group BY a.cust_name,a.phone_no,a.receipt_no,a.trn_date,a.created_by";
      var res_dt = await db_Select(select, table_name, where, order);
      resolve(res_dt);
    } else {
      var select =
          "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,count(b.receipt_no)no_of_items,sum(a.price)price,sum(a.discount_amt)discount_amt,sum(a.cgst_amt)cgst_amt,sum(a.sgst_amt)sgst_amt,sum(a.round_off)round_off,sum(a.amount)net_amt,a.created_by",
        table_name = "td_receipt a,td_item_sale b",
        where = `a.receipt_no = b.receipt_no AND a.trn_date BETWEEN '${data.from_date}' AND '${data.to_date}'AND b.comp_id = ${comp_id}`;
      order =
        "Group BY a.cust_name,a.phone_no,a.receipt_no,a.trn_date,a.created_by";
      var res_dt_2 = await db_Select(select, table_name, where, order);
      resolve(res_dt_2);
    }
  });
};

const getRecptSet = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_receipt_settings",
      where = `comp_id = ${comp_id}`,
      order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    resolve(res_dt);
  });
};

const getPayReport = (data, comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "a.created_by,a.pay_mode,SUM(a.net_amt)net_amt",
      table_name = `(
      Select Distinct a.created_by created_by,a.pay_mode pay_mode,a.net_amt net_amt
      from   td_receipt a, td_item_sale b
      where  a.receipt_no = b.receipt_no 
      and    a.trn_date BETWEEN '${data.date_from}' AND '${data.date_to}'
      and    b.comp_id =  '${comp_id}'
      AND    b.br_id   = '${data.brn_id}'
      AND    a.created_by ='${data.user_id}'
    )a`;
    (where = null), (order = "GROUP BY a.created_by,a.pay_mode");
    var res_dt = await db_Select(select, table_name, where, order);
    resolve(res_dt);
    // console.log(res_dt);
  });
};

const item_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_items",
      where = `com_id=${comp_id}`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const getSaleItemReport = (data, comp_id) => {
  return new Promise(async (resolve, reject) => {
    if (data.brn_id > 0) {
      var select =
          "a.receipt_no,a.trn_date,a.qty,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,b.amount,b.pay_mode,c.item_name,d.branch_name",
        table_name = "td_item_sale a, td_receipt b, md_items c, md_branch d",
        where = `a.receipt_no = b.receipt_no AND a.comp_id = c.com_id AND a.comp_id = d.comp_id AND a.br_id = d.id AND a.item_id = c.id AND a.trn_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.comp_id = ${comp_id} AND a.br_id = ${data.brn_id} AND a.item_id = ${data.item_id}`;
      var res_dt = await db_Select(select, table_name, where, null);
      resolve(res_dt);
    } else {
      var select =
          "a.receipt_no,a.trn_date,a.qty,a.price,a.discount_amt,a.cgst_amt,a.sgst_amt,b.amount,b.pay_mode,c.item_name,d.branch_name",
        table_name = "td_item_sale a, td_receipt b, md_items c, md_branch d",
        where = `a.receipt_no = b.receipt_no AND a.comp_id = c.com_id AND a.comp_id = d.comp_id AND a.br_id = d.id AND a.item_id = c.id AND a.trn_date BETWEEN '${data.from_dt}' AND '${data.to_dt}' AND a.comp_id = ${comp_id} AND a.item_id = ${data.item_id}`;
      var res_dt2 = await db_Select(select, table_name, where, null);
      resolve(res_dt2);
    }
  });
};

const comp_header = () => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_company",
      where = null;
    var comp_dt = await db_Select(select, table_name, where, null);
    resolve(comp_dt);
    // console.log(comp_dt);
  });
};

const receipt_list = (data) => {
  return new Promise(async (resolve, reject) => {
    var select = "receipt_no,trn_date,created_by,net_amt,pay_mode",
      table_name = "td_receipt",
      where = `trn_date BETWEEN '${data.dt_frm}' AND '${data.dt_to}'`;
    var rec_dt = await db_Select(select, table_name, where, null);
    resolve(rec_dt);
  });
};

const rec_bill_dtls = (receipt_no) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "receipt_no,trn_date,created_by,cust_name,phone_no, pay_mode, received_amt, net_amt",
      table_name = "td_receipt",
      where = `receipt_no=${receipt_no}`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const rec_bill_item_dtls = (receipt_no, user) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "a.price,a.discount_amt,a.amount,a.round_off,a.net_amt,b.qty,c.item_name",
      table_name = "td_receipt a, td_item_sale b, md_items c",
      where = `a.receipt_no = b.receipt_no AND a.trn_date = b.trn_date AND b.item_id = c.id
    AND a.receipt_no = ${receipt_no} AND a.created_by = '${user}';`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

module.exports = {
  branch_list,
  getSaleReport,
  getPayReport,
  item_list,
  getSaleItemReport,
  comp_header,
  user_list,
  receipt_list,
  getRecptSet,
  rec_bill_dtls,
  rec_bill_item_dtls,
};
