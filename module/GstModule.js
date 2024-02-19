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

  const getGSTstatement = (data, comp_id) => {
    return new Promise(async (resolve, reject) => {
      if (data.brn_id > 0) {
        var select = "Distinct a.receipt_no, a.trn_date, (a.price - a.discount_amt)taxable_amt, a.cgst_amt, a.sgst_amt, (a.cgst_amt + a.sgst_amt)total_tax, a.net_amt",
        table_name = `td_receipt a, td_item_sale b`;
       where = `a.receipt_no = b.receipt_no AND b.comp_id = '${comp_id}' AND b.br_id = '${data.brn_id}' AND a.trn_date BETWEEN '${data.date_from}' AND '${data.date_to}'`, 
       order = null;
      var res_dt = await db_Select(select, table_name, where, order);
        resolve(res_dt);
      } else {
        var select = "Distinct a.receipt_no, a.trn_date, (a.price - a.discount_amt)taxable_amt, a.cgst_amt, a.sgst_amt, (a.cgst_amt + a.sgst_amt)total_tax, a.net_amt",
        table_name = `td_receipt a, td_item_sale b`;
       where = `a.receipt_no = b.receipt_no AND b.comp_id = '${comp_id}' AND a.trn_date BETWEEN '${data.date_from}' AND '${data.date_to}'`, 
       order = null;
      var res_dt_2 = await db_Select(select, table_name, where, order);
        resolve(res_dt_2);
      }
    });
  };

  const getGstSummary = (data, comp_id) => {
    return new Promise(async (resolve, reject) => {
        if (data.brn_id > 0) {
          var select = "cgst_prtg, SUM(cgst_amt)cgst_amt, SUM(sgst_amt)sgst_amt, SUM(cgst_amt) + SUM(sgst_amt)total_tax",
          table_name = `td_item_sale`;
         where = `comp_id = '${comp_id}' AND br_id = '${data.brn_id}' AND trn_date BETWEEN '${data.date_from}' AND '${data.date_to}'`, 
         order = `GROUP BY cgst_prtg`;
        var res_dt = await db_Select(select, table_name, where, order);
          resolve(res_dt);
        } else {
          var select = "cgst_prtg, SUM(cgst_amt)cgst_amt, SUM(sgst_amt)sgst_amt, SUM(cgst_amt) + SUM(sgst_amt)total_tax",
          table_name = `td_item_sale`;
         where = `comp_id = '${comp_id}' AND trn_date BETWEEN '${data.date_from}' AND '${data.date_to}'`, 
         order = `GROUP BY cgst_prtg`;
        var res_dt_2 = await db_Select(select, table_name, where, order);
          resolve(res_dt_2);
        }
      });
  }


  module.exports = { branch_list, comp_header, getGSTstatement, getGstSummary }