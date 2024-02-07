const express = require("express");
const session = require("express-session");

const bodyParser = require("body-parser");
const { AdminRouter } = require("./routes/AdminRouter");
const { ReportRouter } = require("./routes/ReportRouter");

var app = express(),
  expressLayouts = require("express-ejs-layouts"),
  path = require("path"),
  port = process.env.PORT || 3000;

app.use(bodyParser.json());
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));

app.use((req, res, next) => {
  // res.locals.user = req.session.user;
  // console.log(req.path);
  res.locals.path = req.path;
  // console.log(req.path);
  next();
});

app.get("/",async (req, res) => {
  res.redirect("/login")
});

app.get("/dashboard", async (req, res) => {
  res.render("dashboard/test");
});

// app.get("/location_report", (req, res) => {
//   // const bcrypt = require("bcrypt");
//   // var pass = bcrypt.hashSync("1234", 10);
//   // res.send(pass);
//   res.render("report/location_report");
//   // var user = req.session.user;
//   // if (user) {
//   //   res.redirect("/dashboard");
//   // } else {
//   //   res.redirect("/login");
//   // }
// });

app.get("/login", (req, res) => {
  res.render("dashboard/login");
});

app.use("/admin", AdminRouter);
app.use("/report", ReportRouter);

app.listen(port, (err) => {
  if (err) throw new Error(err);
  else console.log(`App is running at http://localhost:${port}`);
});
