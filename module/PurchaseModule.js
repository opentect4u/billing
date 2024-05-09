const { db_Select, db_Insert } = require("./MasterModule");

const supplier_lt = (comp_id, keyWord) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_supplier",
      where = `comp_id = ${comp_id} AND supplier_name LIKE "%${keyWord}%"`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const supplier_list = (comp_id) => {
    return new Promise(async (resolve, reject) => {
      var select = "*",
        table_name = "md_supplier",
        where = `comp_id = '${comp_id}'`;
      var res_dt = await db_Select(select, table_name, where, null);
      resolve(res_dt);
    });
  };

const save_add_sup_data = (data,comp_id) => {
    return new Promise (async (resolve, reject) =>{
     datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
     var table_name = "md_supplier",
     fields = `(comp_id,supplier_name,gstin,address,created_by,created_at)`,
     values = `('${comp_id}','${data.supplier_name}','${data.gstin}', '${data.address}','${data.created_by}','${datetime}')`,
     where = null,
     flag = 0;
     var res_dt = await db_Insert(table_name,fields,values,where,flag);
     resolve(res_dt);
    })
  }

module.exports = { 
supplier_lt,
supplier_list,
save_add_sup_data };