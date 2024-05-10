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

const sup_list_id = (id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
    table_name = "md_supplier",
    where = `id = ${id}`;
    var res_dt = await db_Select(select,table_name,where,null);
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

const sup_edit_dtls = (id) => {
    return new Promise(async (resolve, reject) => {
      var select = "id,comp_id,supplier_name,gstin,address",
      table_name = "md_supplier",
      where = `id = ${id}`;
      var res_dt = await db_Select(select,table_name,where,null);
      resolve(res_dt);
    });
  };

const save_edit_sup_data = (data) =>{
    return new Promise(async (resolve, reject) => {
     datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
     var table_name = "md_supplier",
     fields = `supplier_name ='${data.supplier_name}', gstin = '${data.gstin}', address = '${data.address}', modified_by = 'admin', modified_at = '${datetime}'`,
     values = null,
     where = `id = '${data.id}'`,
     flag = 1;
     var res_dt = await db_Insert(table_name,fields,values,where,flag);
     resolve(res_dt);
    //  console.log(res_dt,'88');
    })
  }  

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
// ================================================================================================
const br_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = "md_branch",
      where = `comp_id = '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const save_add_purchase_data = (data,comp_id) => {
  return new Promise (async (resolve, reject) =>{
   current_datetime = datetime.now()
   receipt = int(round(current_datetime.timestamp()))
   datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
   date = dateFormat(new Date(), "yyyy-mm-dd");
   var table_name = "td_purchase",
   fields = `(purchase_id,comp_id,br_id, supplier_id,invoice_no,invoice_date,pay_mode,created_by,created_at)`,
   values = `('${receipt}','${comp_id}','${data.br_id}','${data.supplier_id}', '${data.invoice_no}','${date}','${data.pay_mode}','admin','${datetime}')`,
   where = null,
   flag = 0;
   var res_dt = await db_Insert(table_name,fields,values,where,flag);
  //  if(res_dt.suc > 0){
  //   var table_name1 = "md_item_rate",
  //  fields1 = `(item_id,price,discount,cgst,sgst,created_by,created_dt)`,
  //  values1 = `(${res_dt.lastId.insertId},'${data.price}','${data.discount}','${data.cgst}','${data.sgst}','admin','${datetime}')`,
  //  where1 = null,
  //  flag1 = 0;
  //  var res_dt1 = await db_Insert(table_name1,fields1,values1,where1,flag1);
  //  }
   resolve(res_dt);
  })
}

module.exports = { 
supplier_lt,
supplier_list,
save_add_sup_data,
save_edit_sup_data,
sup_edit_dtls,
sup_list_id,
save_add_purchase_data,
br_list
 };