const BranchRouter = require('express').Router()

BranchRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
  });

BranchRouter.get('/branch', async (req, res) => {
    var comp_id = req.session.user.comp_id;
  // console.log(comp_id);
  var location = await item_list(comp_id);
  var res_dt = {
    data: location.suc > 0 ? location.msg : []
  };
  res.render("items/view", res_dt);
})

module.exports = {BranchRouter}