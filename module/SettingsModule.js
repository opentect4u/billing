const { db_Select, db_Insert } = require("./MasterModule");

const settings_details = (comp_id) =>{
    return new Promise(async (resolve, reject) => {
        var select =
            "b.company_name, a.*",
          table_name = "md_receipt_settings a, md_company b",
          where = `a.comp_id = b.id AND a.comp_id = '${comp_id}'`;
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
        }', gst_type = ${data.gst_flag == 'Y' ? `'${data.gst_type}'` : null}, cust_inf = '${
          data.cust_info == "Y" ? "Y" : "N"
        }', pay_mode = '${
          data.pay_mode == "Y" ? "Y" : "N"
        }',unit_flag = '${
          data.unit == "Y" ? "Y" : "N"
        }',stock_flag = '${
          data.inventory == "Y" ? "Y" : "N"
        }',discount_flag = '${
          data.discount == "Y" ? "Y" : "N"
        }', discount_type='${data.discount_type}',rcpt_type='${data.receipt_type}', refund_days = ${data.refund_days > 0 ? data.refund_days : 0}, modified_by = 'admin', modified_at = '${datetime}'`,
        values = null,
        where = `comp_id = ${data.com_id}`,
        flag = 1;
      var res_dt = await db_Insert(table_name, fields, values, where, flag);
      resolve(res_dt);
    });
  };

  const save_settings = (data, type, user_name, comp_id) => {
    return new Promise(async (resolve, reject) => {
      datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var table_name, fields, values, where, flag;
      switch (type) {
        case 'G':
          table_name = "md_receipt_settings"
          fields = data.id > 0 ? `cust_inf = '${
            data.cust_info == "Y" ? "Y" : "N"
          }', pay_mode = '${
            data.pay_mode == "Y" ? "Y" : "N"
          }',unit_flag = '${
            data.unit == "Y" ? "Y" : "N"
          }',stock_flag = '${
            data.inventory == "Y" ? "Y" : "N"
          }',rcpt_type='${data.receipt_type}', refund_days = ${data.refund_days > 0 ? data.refund_days : 0}, modified_by = '${user_name}', modified_at = '${datetime}'` : '(comp_id, cust_inf, pay_mode, unit_flag, stock_flag, rcpt_type, refund_days, created_by, created_at)'
          values = `(${comp_id}, '${ data.cust_info == "Y" ? "Y" : "N" }', '${ data.pay_mode == "Y" ? "Y" : "N" }', '${ data.unit == "Y" ? "Y" : "N" }', '${ data.inventory == "Y" ? "Y" : "N" }', '${data.receipt_type}', ${data.refund_days > 0 ? data.refund_days : 0}, '${user_name}', '${datetime}')`
          where = `comp_id = ${comp_id}`
          flag = data.id > 0 ? 1 : 0
          break;
        case 'S':
          table_name = "md_receipt_settings"
          fields = data.id > 0 ? `gst_flag = '${
            data.gst_flag == "Y" ? "Y" : "N"
          }' ${data.gst_flag == 'Y' ? `, gst_type = '${data.gst_type}'` : ''}, modified_by = '${user_name}', modified_at = '${datetime}'` : '(comp_id, gst_flag, gst_type, created_by, created_at)'
          values = `(${comp_id},'${ data.gst_flag == "Y" ? "Y" : "N" }',${data.gst_flag == 'Y' ? `'${data.gst_type}'` : null},'${user_name}', '${datetime}')`
          where = `comp_id = ${comp_id}`
          flag = data.id > 0 ? 1 : 0
          break;
        case 'D':
          table_name = "md_receipt_settings"
          fields = data.id > 0 ? `discount_flag = '${
            data.discount == "Y" ? "Y" : "N"
          }', discount_position = '${
            data.discount_pos == "Y" ? "I" : "B"
          }', discount_type='${data.discount_type}', modified_by = '${user_name}', modified_at = '${datetime}'` : '(comp_id, discount_flag, discount_position, discount_type, created_by, created_at)'
          values = `(${comp_id},'${ data.discount == "Y" ? "Y" : "N" }','${ data.discount_pos == "Y" ? "I" : "B" }','${data.discount_type}','${user_name}', '${datetime}')`
          where = `comp_id = ${comp_id}`
          flag = data.id > 0 ? 1 : 0
          break;
      
        default:
          break;
      }
      var res_dt = await db_Insert(table_name, fields, values, where, flag);
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

module.exports = { settings_details, save_edit_settings, comp_list, save_add_settings, save_settings }