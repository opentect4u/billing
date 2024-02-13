const express = require ('express');
const { item_lt } = require('../module/ItemModule');
const ItemRouter = express.Router();


ItemRouter.get("/items_details", async (req, res) => {
    var data = req.query;
    console.log(data);
    var item_list = await item_lt(data.comp_id);
    var res_dt = {
        data: item_list.suc > 0 ? item_list.msg : [],
    }
    console.log(res_dt);
    res.render("items/items_details",res_dt);
})

module.exports = { ItemRouter };