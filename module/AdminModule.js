const { db_Select, db_Insert } = require("./MasterModule");

module.exports = {
    GetLocationList: (id = 0) => {
        return new Promise(async (resolve, reject) => {
            var select = "sl_no, location_name",
              table_name = "md_location",
              where = id > 0 ? `sl_no = ${id}` : null;
            var res_dt = await db_Select(select, table_name, where, null);
            resolve(res_dt);
        });
    },
    getBranchList: (comp_id, id = 0) => {
        return new Promise(async (resolve, reject) => {
            var select = "id, comp_id, branch_name, branch_address, location, contact_person, phone_no, email_id",
              table_name = "md_branch",
              where = `comp_id = ${comp_id} ${id > 0 ? `id = ${id}` : ''}`;
            var res_dt = await db_Select(select, table_name, where, null);
            resolve(res_dt);
        });
    }
}