const express = require('express');
const { db_Select, user_type_master, db_Insert } = require('../module/MasterModule');
UserRouter = express.Router(),
dateFormat = require('dateformat');

// UserRouter.get("/dashboard", async (req, res) => {
//     res.render("dashboard/dashboard");
// })

UserRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });

const user_list = (comp_id, id = 0) => {
    return new Promise(async (resolve, reject) => {
        var select = 'id, comp_id, br_id, user_name, user_type, user_id, phone_no, email_id, active_flag',
        table_name = 'md_user',
        whr = `comp_id = ${comp_id} ${id > 0 ? `AND id = ${id}` : ''}`,
        order = null;
        var user_dt = await db_Select(select, table_name, whr, order)
        resolve(user_dt)
    })
}

UserRouter.get('/list', async (req, res) => {
    var comp_id = req.session.user.comp_id;
    var user_dt = await user_list(comp_id)
    res.render('user_list/view', {data: user_dt.suc > 0 ? user_dt.msg : []})
})

UserRouter.get('/edit', async (req, res) => {
    var data = req.query
    var comp_id = req.session.user.comp_id,
    br_list = await db_Select('*', 'md_branch', `comp_id = ${comp_id}`, null),
    user_dt = [];
    
    if(data.id > 0){
        user_dt = await user_list(comp_id, data.id)
    }
    var view_data = {
        id: data.id > 0 ? data.id : 0,
        data: user_dt.suc > 0 ? user_dt.msg : [],
        user_type: user_type_master,
        br_list: br_list.suc > 0 ? br_list.msg : []
    }
    res.render('user_list/edit', view_data)
})

UserRouter.post('/save_data', async (req, res) => {
    var data = req.body,
    comp_id = req.session.user.comp_id,
    user_name = req.session.user.user_name,
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var table_name = 'md_user',
    fields = data.id > 0 ? `user_name = '${data.user_name}', user_type = '${data.user_type}', user_id = '${data.phone_no}', phone_no = '${data.phone_no}', email_id = '${data.email_id}', active_flag = '${data.active_flag}', modified_by = '${user_name}', modified_dt = '${datetime}'` : '(comp_id, br_id, user_name, user_type, user_id, phone_no, email_id, active_flag, created_by, created_dt)',
    values = `('${comp_id}', '${data.br_id}', '${data.user_name}', '${data.user_type}', '${data.phone_no}', '${data.phone_no}', '${data.email_id}', '${data.active_flag}', '${user_name}', '${datetime}')`,
    whr = data.id > 0 ? `id = ${data.id}` : null,
    flag = data.id > 0 ? 1 : 0;
    var res_dt = await db_Insert(table_name, fields, values, whr, flag)
    if(res_dt.suc > 0){
        req.session.message = {
            type: "success",
            message: `${data.id > 0 ? 'Updated' : 'Saved'} successfully`,
        };
    }else{
        req.session.message = {
            type: "danger",
            message: res_dt.msg,
        };
    }
    res.redirect('/user/list')
})

module.exports = {UserRouter}