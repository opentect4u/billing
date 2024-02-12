const { db_Select } = require("./MasterModule");

const comp_lt = () => {
    return new Promise (async (resolve, reject) => {
        var select = "*",
        table_name = "md_company",
        where = null;
        var res_dt = await db_Select(select,table_name,where,null);
        resolve(res_dt);
    });
};

const upload_data = (comp_id) => {
    return new Promise (async (resolve, reject) => {
        var select = "a.hsn_code,a.item_name,b.price,b.discount,b.cgst,b.sgst,a.created_by,a.created_dt",
        table_name = "md_items a, md_item_rate b",
        where = `a.id = b.item_id AND a.comp_id=${comp_id}`
        var res_dt = await db_Select(select,table_name,where,null);
        resolve(res_dt);
    });
};

module.exports = {comp_lt, upload_data}