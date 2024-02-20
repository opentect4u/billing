const { db_Select, db_Insert } = require("./MasterModule");

const settings_details = (comp_id) =>{
    return new Promise(async (resolve, reject) => {
        var select =
            "a.comp_id,a.gst_flag,a.cust_inf,a.pay_mode,b.company_name",
          table_name = "md_receipt_settings a, md_company b",
          where = `a.comp_id = b.id AND a.comp_id = '${comp_id}'`;
        var res_dt = await db_Select(select, table_name, where, null);
        resolve(res_dt);
      });
};

const edit_settings_dtls = (data) =>{
    return new Promise(async (resolve, reject) => {
        var select =
            "a.comp_id,a.gst_flag,a.cust_inf,a.pay_mode,b.company_name",
          table_name = "md_receipt_settings a, md_company b",
          where = `a.comp_id = b.id AND a.comp_id = '${data.comp_id}'`;
        var res_dt = await db_Select(select, table_name, where, null);
        resolve(res_dt);
      });
};

const save_edit_settings = (data) => {
    return new Promise(async (resolve, reject) => {
      datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var table_name = "md_receipt_settings",
        fields = `gst_flag = '${
          data.gst_flag == "Y" ? "Y" : "N"
        }',cust_inf = '${
          data.cust_info == "Y" ? "Y" : "N"
        }', pay_mode = '${
          data.pay_mode == "Y" ? "Y" : "N"
        }',modified_by = 'admin', modified_at = '${datetime}'`,
        values = null,
        where = `comp_id = ${data.com_id}`,
        flag = 1;
      var res_dt = await db_Insert(table_name, fields, values, where, flag);
      // console.log(res_dt);
      resolve(res_dt);
    });
  };

  const comp_list = (comp_id) => {
    return new Promise(async (resolve, reject) => {
      var select = "*",
        table_name = "md_company",
        where = `id= '${comp_id}'`;
      var res_dt = await db_Select(select, table_name, where, null);
      resolve(res_dt);
    });
  };

  const save_add_settings = (data) => {
    return new Promise(async (resolve, reject) => {
      datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var table_name = "md_receipt_settings",
        fields = `(comp_id,gst_flag,cust_inf,pay_mode,created_by,created_at)`,
        values = `('${data.comp_id}','${
          data.gst_flag == "Y" ? "Y" : "N"
        }','${data.cust_info == "Y" ? "Y" : "N"}','${data.pay_mode == "Y" ? "Y" : "N"}','admin','${datetime}')`,
        where = null,
        flag = 0;
      var res_dt = await db_Insert(table_name, fields, values, where, flag);
      resolve(res_dt);
    });
  };

module.exports = { settings_details,edit_settings_dtls, save_edit_settings, comp_list, save_add_settings }