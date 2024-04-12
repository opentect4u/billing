const { db_Select } = require('../module/MasterModule')

const CustRouter = require('express').Router()

const comp_list = (comp_id, id = 0) => {
    return new Promise(async (resolve, reject) => {
        var select = '*',
        table_name = 'md_customer',
        whr = `comp_id = ${comp_id} ${id > 0 ? `AND cust_id = ${id}` : null}`,
        order = null;
        var res_dt = await db_Select(select, table_name, whr, order)
        resolve(res_dt)
    })
}

CustRouter.get('/list', async (req, res) => {
    var comp_id = req.session.user.comp_id
    var comp_dtls = await comp_list(comp_id)
    var res_dt = {
        data: comp_dtls.suc > 0 ? comp_dtls.msg : []
    };
    res.render('customer/view', res_dt)
})

CustRouter.get('/add', async (req, res) => {
    var comp_id = req.session.user.comp_id,
    data = req.query, cust_dtls = [];
    if(data.id > 0){
        cust_dtls = await comp_list(comp_id, data.id)
    }

    var res_dt = {
        id: data.id,
        data: cust_dtls.suc > 0 ? cust_dtls.msg : []
    };
    res.render('customer/edit', res_dt)
})

module.exports = {CustRouter}