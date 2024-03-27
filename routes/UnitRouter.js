const { getUnitList, saveUnit } = require('../module/UnitModule');

const UnitRouter = require('express').Router()

UnitRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
        res.redirect("/login");
    } else {
        next();
    }
});

UnitRouter.get('/unit_master', async (req, res) => {
    var comp_id = req.session.user.comp_id;
    var unit_dtls = await getUnitList(comp_id);
    console.log(unit_dtls);
    var viewData = {
        data: unit_dtls.suc > 0 ? unit_dtls.msg : [],
    };
    res.render('unit/view', viewData);
})

UnitRouter.get('/edit_unit', async (req, res) => {
    var data = req.query;
    var comp_id = req.session.user.comp_id, unit_list = [];
    if(data.id > 0){
        unit_list = await getUnitList(comp_id, data.id)
    }
    var res_dt = {
        data: unit_list.suc > 0 ? unit_list.msg : [],
        id: data.id,
    }
    res.render("unit/add", res_dt);
})

UnitRouter.post('/save_unit', async (req, res) => {
    var data = req.body,
    comp_id = req.session.user.comp_id,
    user_name = req.session.user.user_name;
    var res_dt = await saveUnit(data, comp_id, user_name)
    console.log(res_dt);
    if(res_dt.suc > 0){
        req.session.message = {
            type: "success",
            message: "Saved successfully",
        };
    }else{
        req.session.message = {
            type: "danger",
            message: "Date now saved",
        };
    }
    res.redirect('/unit_master')
})

module.exports = { UnitRouter }