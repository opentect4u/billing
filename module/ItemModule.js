const { db_Select } = require("./MasterModule");

const item_lt = (comp_id) => {
return new Promise(async(resolve, reject) => {
    var select ="*",
    table_name = "md_items",
    where = `comp_id = ${comp_id}`
    var res_dt = await db_Select(select,table_name,where,null);
    resolve(res_dt);
});
};

module.exports = {item_lt}