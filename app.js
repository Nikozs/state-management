"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const username = "foo";
const password = "bar";

app.use(cookieParser());
app.use(
  session({
    secret: "testi",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

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

app.get("/secret", (req, res) => {
  console.log("Cookies: ", req.cookies);
  if (req.session.logged) {
    res.render("secret");
  } else {
    res.redirect("/form");
  }
  console.log("Cookies: ", req.cookies);
});

app.post("/login", (req, res) => {
  if (req.body.username === username && req.body.password === password) {
    req.session.logged = true;
    res.redirect("/secret");
  } else {
    res.redirect("/form");
  }
  console.log("Cookies: ", req.cookies);
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
