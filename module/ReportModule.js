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
          "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,b.br_id,c.branch_name,count(b.receipt_no)no_of_items,sum(a.price)price,sum(a.discount_amt)discount_amt,sum(a.cgst_amt)cgst_amt,sum(a.sgst_amt)sgst_amt,sum(a.round_off)rount_off,sum(a.amount)net_amt,a.created_by,d.gst_flag,d.cust_inf",
        table_name = "td_receipt a,td_item_sale b,md_branch c,md_receipt_settings d",
        where = `a.receipt_no = b.receipt_no AND b.comp_id = c.comp_id AND b.br_id = c.id AND b.comp_id = d.comp_id AND b.br_id = ${data.brn_id}`;
      var res_dt = await db_Select(select, table_name, where, null);
      resolve(res_dt);
    } else {
      var select =
          "a.cust_name,a.phone_no,a.receipt_no,a.trn_date,b.br_id,c.branch_name,count(b.receipt_no)no_of_items,sum(a.price)price,sum(a.discount_amt)discount_amt,sum(a.cgst_amt)cgst_amt,sum(a.sgst_amt)sgst_amt,sum(a.round_off)round_off,sum(a.amount)net_amt,a.created_by,d.gst_flag,d.cust_inf",
        table_name = "td_receipt a,td_item_sale b,md_branch c,md_receipt_settings d",
        where = `a.receipt_no = b.receipt_no AND b.br_id = c.id AND b.comp_id = c.comp_id AND b.comp_id = d.comp_id`;
      order = "Group BY a.cust_name,a.phone_no,a.receipt_no,a.trn_date,b.br_id,c.branch_name ORDER BY a.receipt_no";
      var res_dt_2 = await db_Select(select, table_name, where, order);
      resolve(res_dt_2);
    }
  });
};


const user_list = () =>{
 return new Promise( async (resolve, reject) => {
  var select = "created_by,user_type",
  table_name = "md_user",
  where = `user_type= 'U'`;
  var user_dt = await db_Select(select,table_name,where,null);
  resolve(user_dt);
 });
};

const getPayReport = (data) => {
  return new Promise (async (resolve, reject) => {
    var select = "cust_name,pay_mode, COUNT(receipt_no) tot_tnx, SUM(net_amt) tot_amt",
    table_name = "td_receipt",
    where = null,
    order = "GROUP BY pay_mode"
    var res_dt = await db_Select(select,table_name,where,order);
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

const comp_header = () => {
  return new Promise(async (resolve, reject) => {
   var select = "*",
   table_name = "md_company",
   where = null;
   var comp_dt = await db_Select(select,table_name,where,null)
   resolve(comp_dt);
  //  console.log(comp_dt);
  });
};

module.exports = { branch_list, getSaleReport, user_list, getPayReport, item_list, getSaleItemReport, receipt_list, comp_header };
