const { db_Select, db_Insert } = require("./MasterModule");

module.exports = {
    getUnitList: (comp_id, id = 0) => {
        return new Promise(async (resolve, reject) => {
            var select = "sl_no, comp_id, unit_name",
                table_name = "md_unit",
                where = `comp_id = ${comp_id} ${id > 0 ? `AND sl_no = ${id}` : ''}`;
            var res_dt = await db_Select(select, table_name, where, null);
            resolve(res_dt);
        });
    },
    saveUnit: (data, comp_id, user_name) => {
        return new Promise(async (resolve, reject) => {
            var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            var table_name = "md_unit",
                fields = data.id > 0 ? `unit_name ='${data.unit_name}', modified_by = '${user_name}', modified_at = '${datetime}'` : '(comp_id, unit_name, created_by, created_at)',
                values = `(${comp_id}, '${data.unit_name}', '${user_name}', '${datetime}')`,
                where = data.id > 0 ? `sl_no = '${data.id}'` : null,
                flag = data.id > 0 ? 1 : 0;
            var res_dt = await db_Insert(table_name, fields, values, where, flag);
            resolve(res_dt);
        })
    }
}