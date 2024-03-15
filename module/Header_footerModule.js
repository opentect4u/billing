const { db_Select, db_Insert } = require("./MasterModule");

const comp_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_company",
      where = `id= '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const show_header_footer_flag = (data) => {
  return new Promise(async (resolve, reject) => {
    var select =
        "a.comp_id,a.header1,a.on_off_flag1,a.header2,a.on_off_flag2,a.footer1,a.on_off_flag3,a.footer2,a.on_off_flag4,b.id,b.company_name",
      table_name = "md_header_footer a, md_company b",
      where = `a.comp_id = b.id AND a.comp_id = '${data.comp_id}';`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const save_edit_header_footer = (data) => {
  return new Promise(async (resolve, reject) => {
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var table_name = "md_header_footer",
      fields = `header1 = '${data.header_1}',on_off_flag1 = '${
        data.header_1_flag == "Y" ? "Y" : "N"
      }',header2 = '${data.header_2}',on_off_flag2 = '${
        data.header_2_flag == "Y" ? "Y" : "N"
      }', footer1 = '${data.footer_1}', on_off_flag3 = '${
        data.footer_1_flag == "Y" ? "Y" : "N"
      }', footer2 = '${data.footer_2}', on_off_flag4 = '${
        data.footer_2_flag == "Y" ? "Y" : "N"
      }', modified_by = 'admin', modified_at = '${datetime}'`,
      values = null,
      where = `comp_id = ${data.com_id}`,
      flag = 1;
    var res_dt = await db_Insert(table_name, fields, values, where, flag);
    // console.log(res_dt);
    resolve(res_dt);
  });
};

const save_add_header_footer = (data) => {
  return new Promise(async (resolve, reject) => {
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var table_name = "md_header_footer",
      fields = `(comp_id,header1,on_off_flag1,header2,on_off_flag2,footer1,on_off_flag3,footer2,on_off_flag4,created_by,created_at)`,
      values = `('${data.comp_id}','${data.header_1}','${
        data.header_1_flag == "Y" ? "Y" : "N"
      }','${data.header_2}','${data.header_2_flag == "Y" ? "Y" : "N"}','${
        data.footer_1
      }','${data.footer_1_flag == "Y" ? "Y" : "N"}','${data.footer_2}','${
        data.footer_2_flag == "Y" ? "Y" : "N"
      }','admin','${datetime}')`,
      where = null,
      flag = 0;
    var res_dt = await db_Insert(table_name, fields, values, where, flag);
    resolve(res_dt);
  });
};
module.exports = {
  comp_list,
  show_header_footer_flag,
  save_edit_header_footer,
  save_add_header_footer,
};
