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

const item_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "id,item_name",
      table_name = "md_items",
      where = `comp_id = '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const unit_list = (comp_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "sl_no,unit_name",
      table_name = "md_unit",
      where = `comp_id = '${comp_id}'`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
    // console.log(res_dt);
  });
};

const save_add_purchase_data = (data,comp_id) => {
  return new Promise (async (resolve, reject) =>{
   var current_datetime = new Date(),
    receipt = Math.floor(current_datetime.getTime()/1000),
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    date = dateFormat(new Date(), "yyyy-mm-dd");
    // console.log(data, receipt);
   var table_name = "td_purchase",
   fields = data.receipt > 0 ? `supplier_id='${data.id}',pay_mode='${data.pay_mode}'` : `(purchase_id,comp_id,br_id, supplier_id,invoice_no,invoice_date,pay_mode,created_by,created_at)`,
   values = `('${receipt}','${comp_id}','${data.brn_id}','${data.id}', '${data.invoice_no}','${date}','${data.pay_mode}','admin','${datetime}')`,
   where = data.receipt > 0 ? `purchase_id = ${data.receipt}` : null,
   flag = data.receipt > 0 ? 1 : 0;
   var res_dt = await db_Insert(table_name,fields,values,where,flag);
   console.log(res_dt);
   if(res_dt.suc > 0){
    if(Array.isArray(data.item_name)){
      for(let i=0; i<data.item_name.length; i++){
        var table_name1 = 'td_item_purchase',
        fields1 = data.receipt > 0 ? `price=${data.price[i]}, cgst_prtg=${data.cgst[i]}, cgst_amt=${((data.price[i]*data.cgst[i])/100).toFixed(2)}, sgst_prtg=${data.sgst[i]}, sgst_amt=${((data.price[i]*data.sgst[i])/100).toFixed(2)}, qty=${data.qty[i]}, modified_by="admin", modified_dt='${datetime}'` : '(purchase_id, comp_id, br_id, item_id, price, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, unit_name, created_by, created_dt)',
        values1 = `(${receipt}, ${comp_id}, ${data.brn_id}, ${data.item_name[i]}, ${data.price[i]}, ${data.cgst[i]}, ${((data.price[i]*data.cgst[i])/100).toFixed(2)}, ${data.sgst[i]}, ${((data.price[i]*data.sgst[i])/100).toFixed(2)}, ${data.qty[i]}, '${data.unit_name[i]}',"admin",'${datetime}')`,
        where1 = data.receipt > 0 ? `purchase_id = ${data.receipt} AND item_id = ${data.item_name[i]} AND unit_name = '${data.unit_name[i]}'` : null,
        flag1 = data.receipt > 0 ? 1 : 0;
        var res_dt1 = await db_Insert(table_name1, fields1, values1, where1, flag1)
      }
    }else{
      var table_name1 = 'td_item_purchase',
        fields1 = data.receipt > 0 ? `price=${data.price}, cgst_prtg=${data.cgst}, cgst_amt=${((data.price*data.cgst)/100).toFixed(2)}, sgst_prtg=${data.sgst}, sgst_amt=${((data.price*data.sgst)/100).toFixed(2)}, qty=${data.qty}, modified_by="admin", modified_dt='${datetime}'` : '(purchase_id, comp_id, br_id, item_id, price, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, unit_name, created_by, created_dt)',
        values1 = `(${receipt}, ${comp_id}, ${data.brn_id}, ${data.item_name}, ${data.price}, ${data.cgst}, ${((data.price*data.cgst)/100).toFixed(2)}, ${data.sgst}, ${((data.price*data.sgst)/100).toFixed(2)}, ${data.qty}, '${data.unit_name}',"admin",'${datetime}')`,
        where1 = data.receipt > 0 ? `purchase_id = ${data.receipt} AND item_id = ${data.item_name} AND unit_name = '${data.unit_name}'` : null,
        flag1 = data.receipt > 0 ? 1 : 0;
        var res_dt1 = await db_Insert(table_name1, fields1, values1, where1, flag1)
    }}
    resolve(res_dt1);
    // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", res_dt1);
  
  })
}

// ===========================================================================================
// purchase_info_main

const purchase_list = (comp_id, purchase_id = 0) => {
  return new Promise(async (resolve, reject) => {
    var select = "a.purchase_id, a.br_id, c.branch_name, a.supplier_id, a.invoice_no, a.pay_mode, b.supplier_name, b.gstin, b.address",
      table_name = "td_purchase a, md_supplier b, md_branch c",
      where = `a.supplier_id=b.id AND a.br_id=c.id AND a.comp_id = '${comp_id}' AND b.comp_id = '${comp_id}' ${purchase_id > 0 ? `AND a.purchase_id = ${purchase_id}` : ''}`;
    var res_dt = await db_Select(select, table_name, where, null);
    resolve(res_dt);
  });
};

const purchase_item_list = (comp_id, purchase_id = 0) => {
  return new Promise(async (resolve, reject) => {
    var select = "purchase_id, comp_id, br_id, item_id, price, cgst_prtg, cgst_amt, sgst_prtg, sgst_amt, qty, unit_name",
    table_name = "td_item_purchase",
    where = `comp_id = '${comp_id}' ${purchase_id > 0 ? `AND purchase_id = ${purchase_id}` : ''}`;
    var res_dt = await db_Select(select, table_name, where, null);
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
br_list,
item_list,
unit_list,
purchase_list,
purchase_item_list
 };