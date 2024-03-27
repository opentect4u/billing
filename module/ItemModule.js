const { db_Select, db_Insert } = require("./MasterModule");

const item_lt = (comp_id, keyWord) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_items",
      where = `comp_id = ${comp_id} AND item_name LIKE "%${keyWord}%"`;
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
      where = `comp_id = '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const item_edit_dtls = (id) => {
  return new Promise(async (resolve, reject) => {
    var select = "a.id,a.comp_id,a.hsn_code,a.item_name, a.unit_id,b.item_id,b.price,b.discount,b.cgst,b.sgst",
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
   fields = `item_name ='${data.item_name}', unit_id = '${data.unit_id}', modified_by = 'admin', modified_dt = '${datetime}'`,
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
   fields = `(comp_id,hsn_code,item_name, unit_id,created_by,created_dt)`,
   values = `('${comp_id}','${data.code}','${data.item_name}', '${data.unit_id}','admin','${datetime}')`,
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

const getStockList = (comp_id, br_id, item_id = 0) => {
  return new Promise(async (resolve, reject) => {
    var select = "a.comp_id, a.br_id, a.item_id, b.item_name, a.stock",
    table_name = "td_stock a, md_items b",
    where = `a.item_id = b.id AND a.comp_id = b.comp_id AND a.comp_id = ${comp_id} AND a.br_id = ${br_id} ${item_id > 0 ? `AND a.item_id = ${item_id}` : ''}`;
    var res_dt = await db_Select(select,table_name,where,null);
    resolve(res_dt);
  });
}

const save_item_stock = (comp_id, br_id, user_name, data) => {
  return new Promise (async (resolve, reject) =>{
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var table_name = "td_stock",
    fields = `(comp_id, br_id, item_id, stock, created_by, created_dt)`,
    values = `('${comp_id}', '${br_id}', '${data.item_id}','${data.stock}','${user_name}','${datetime}')`,
    where = null,
    flag = 0;
    var res_dt = await db_Insert(table_name,fields,values,where,flag);
    resolve(res_dt);
   })
}

module.exports = { item_lt, item_list_id, item_edit_dtls, item_list, save_edit_item_data, save_add_item_data, getStockList };
