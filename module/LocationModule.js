const { db_Select, db_Insert } = require("./MasterModule");

const location_list = () => {
    return new Promise(async (resolve, reject) => {
      var select = "sl_no, location_name",
        table_name = "md_location";
      var res_dt = await db_Select(select, table_name, null);
      resolve(res_dt);
    });
  };

const add_location = (data,user_id) => {
    return new Promise(async (resolve, reject) => {
        datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        // console.log(user,'22222');
        var table_name = "md_location",
        fields = `(location_name,created_by,created_at)`,
        values = `('${data.loc_name}','${user_id}', '${datetime}')`,
        where = null,
        flag = 0;
        var res_dt = await db_Insert(table_name,fields,values,where,flag);
        resolve(res_dt);
    });
};

const loc_edit_dtls = (data) => {
  return new Promise(async (resolve, reject) => {
    var select = "sl_no,location_name",
    table_name = "md_location",
    where = `sl_no = ${data.sl_no}`;
    var res_dt = await db_Select(select,table_name,where,null);
    resolve(res_dt);
  });
};

const edit_location = (data,user_id) => {
    return new Promise(async (resolve, reject) => {
        datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var table_name = "md_location",
        fields = `location_name = '${data.loc_name}',modified_by = '${user_id}',modified_at = '${datetime}'`,
        values = null,
        where = `sl_no = '${data.sl_no}'`,
        flag = 1;
        var res_dt = await db_Insert(table_name,fields,values,where,flag);
        resolve(res_dt);
    });
};

module.exports = {location_list,add_location,edit_location,loc_edit_dtls};

