const express = require("express");
const session = require("express-session");

const bodyParser = require("body-parser");
const { AdminRouter } = require("./routes/AdminRouter");
const { ReportRouter } = require("./routes/ReportRouter");
const { BulkRouter } = require("./routes/BulkRouter");
const { ItemRouter } = require("./routes/ItemRouter");
const { Header_footerRouter } = require("./routes/Header_footerRouter");
const { GstRouter } = require("./routes/GstRouter");
const { SettingsRouter } = require("./routes/SettingsRouter");
const { UnitRouter } = require("./routes/UnitRouter");
const { ReceiptRouter } = require("./routes/ReceiptRouter");
const { UserRouter } = require("./routes/UserRoter");
const { ApiRouter } = require("./routes/ApiRouter");
const { LocationRouter } = require("./routes/LocationRouter");
const { CustRouter } = require("./routes/CustomerRouter");

var app = express(),
  expressLayouts = require("express-ejs-layouts"),
  path = require("path"),
  port = process.env.PORT || 3003;

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

// Set up the session middleware
app.use(
  session({
    secret: "Synergic Billing", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie : {
      maxAge: 3600000
    }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  // console.log(req.path);
  res.locals.path = req.path;
  res.locals.message = req.session.message;
  delete req.session.message;
  // console.log(req.path);
  console.log('MAIN HERE', req.path);
  next();
});

app.get("/",async (req, res) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    res.redirect("/report/location_report");
  }
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
app.use("/bulk", BulkRouter);
app.use("/items",ItemRouter);
app.use("/header_footer",Header_footerRouter);
app.use("/gst",GstRouter);
app.use("/settings",SettingsRouter)
app.use(UnitRouter)
app.use('/user', UserRouter)
app.use('/bill', ReceiptRouter)
app.use('/api', ApiRouter)
app.use('/location', LocationRouter)
app.use('/customer', CustRouter)

app.listen(port, (err) => {
  if (err) throw new Error(err);
  else console.log(`App is running at http://localhost:${port}`);
});
