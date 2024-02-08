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

const user_list = (brn_id) => {
 return new Promise (async (resolve, reject) => {
 var select = "user_name",
 table_name = "md_user",
 where = `br_id =${brn_id} AND user_type = 'U'`,
 order = null;
 var ul_dt = await db_Select(select,table_name,where,order)
 resolve(ul_dt)
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


const getPayReport = (data) => {
  return new Promise (async (resolve, reject) => {
    var select = "a.created_by,a.pay_mode,a.net_amt,b.br_id,c.branch_name",
    table_name = "td_receipt a, td_item_sale b, md_branch c",
    where = `a.receipt_no = b.receipt_no AND b.br_id = c.id AND b.br_id = ${data.brn_id} AND a.created_by ='${data.user_id}'`;
    order = "GROUP BY a.pay_mode"
    var res_dt = await db_Select(select,table_name,where,order);
    resolve(res_dt)
    // console.log(res_dt);
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

const receipt_list = (data) => {
  return new Promise (async (resolve, reject) => {
    var select = "receipt_no,trn_date,created_by,net_amt,pay_mode",
    table_name = "td_receipt",
    where = `trn_date BETWEEN '${data.dt_frm}' AND '${data.dt_to}'`;
    var rec_dt = await db_Select(select, table_name, where, null);
    resolve(rec_dt)
  });
};

module.exports = { branch_list, getSaleReport, getPayReport, item_list, getSaleItemReport, comp_header, user_list, receipt_list };
