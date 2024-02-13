const { db_Select, db_Insert } = require("./MasterModule");

const comp_lt = () => {
    return new Promise (async (resolve, reject) => {
        var select = "*",
        table_name = "md_company",
        where = null;
        var res_dt = await db_Select(select,table_name,where,null);
        resolve(res_dt);
    });
};


module.exports = {comp_lt}