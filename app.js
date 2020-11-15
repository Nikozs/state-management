"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("./utils/pass");
const session = require("express-session");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const username = "foo";
const password = "bar";


const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/form");
  }
};


app.use(cookieParser());
app.use(
  session({
    secret: "testi",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/form", (req, res) => {
  if (req.session.logged) {
    res.redirect("/secret");
  } else {
    res.render("form");
  }
  console.log("Cookies: ", req.cookies);
});

app.get("/secret", loggedIn, (req, res) => {
  res.render("secret");
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/form" }), (req, res) => {
    console.log("success");
    res.redirect("/secret");
  }
);

app.get("/logout", function(req, res){
    req.logout()
    res.redirect("/");
  });

app.get("/setCookie/:clr", (req, res) => {
  res.cookie("color", req.params.clr);
  res.send("testi");
  console.log("Cookies: ", req.cookies);
});

app.get("/readCookie", (req, res) => {
  console.log("Cookie: ", req.cookies.color);
  res.send("testi");
  console.log("Cookies: ", req.cookies);
});

app.get("/deleteCookie", (req, res) => {
  res.clearCookie("color");
  res.send("testi");
  console.log("Cookies: ", req.cookies);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));