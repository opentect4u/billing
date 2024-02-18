const { db_Select, db_Insert } = require("./MasterModule");

const item_lt = (comp_id, keyWord) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_items",
      where = `com_id = ${comp_id} AND item_name LIKE "%${keyWord}%"`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const item_list_id = (id) => {
return new Promise(async (resolve, reject) => {
  var select = "*",
  table_name = "md_items",
  where = `id = ${id}`;
  var res_dt = await db_Select(select,table_name,where,null);
  resolve(res_dt);
});
};

const item_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_items",
      where = `com_id = '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const item_edit_dtls = (id) => {
  return new Promise(async (resolve, reject) => {
    var select = "a.id,a.com_id,a.hsn_code,a.item_name,b.item_id,b.price,b.discount,b.cgst,b.sgst",
    table_name = "md_items a , md_item_rate b",
    where = `a.id = b.item_id AND a.id = ${id}`;
    var res_dt = await db_Select(select,table_name,where,null);
    resolve(res_dt);
  });
};

const save_edit_item_data = (data) =>{
  return new Promise(async (resolve, reject) => {
   datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
   var table_name = "md_items",
   fields = `item_name ='${data.item_name}', modified_by = 'admin', modified_dt = '${datetime}'`,
   values = null,
   where = `id = '${data.id}'`,
   flag = 1;
   var res_dt = await db_Insert(table_name,fields,values,where,flag);
   if(res_dt.suc > 0){
    var table_name1 = "md_item_rate",
   fields1 = `price = '${data.price}',discount = '${data.discount}',cgst = '${data.cgst}',sgst = '${data.sgst}', modified_by = 'admin', modified_dt = '${datetime}'`,
   values1 = null,
   where1 = `item_id = ${data.id}`,
   flag1 = 1;
   var res_dt1 = await db_Insert(table_name1,fields1,values1,where1,flag1);
   }
   resolve(res_dt1);
  })
}


const save_add_item_data = (data,comp_id) => {
  return new Promise (async (resolve, reject) =>{
   datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
   var table_name = "md_items",
   fields = `(com_id,hsn_code,item_name,created_by,created_dt)`,
   values = `('${comp_id}','${data.code}','${data.item_name}','admin','${datetime}')`,
   where = null,
   flag = 0;
   var res_dt = await db_Insert(table_name,fields,values,where,flag);
   if(res_dt.suc > 0){
    var table_name1 = "md_item_rate",
   fields1 = `(item_id,price,discount,cgst,sgst,created_by,created_dt)`,
   values1 = `(${res_dt.lastId.insertId},'${data.price}','${data.discount}','${data.cgst}','${data.sgst}','admin','${datetime}')`,
   where1 = null,
   flag1 = 0;
   var res_dt1 = await db_Insert(table_name1,fields1,values1,where1,flag1);
   }
   resolve(res_dt1);
  })
}

module.exports = { item_lt, item_list_id, item_edit_dtls, item_list, save_edit_item_data, save_add_item_data };
