const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");

const tempelatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", tempelatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});



app.post("/signup", async (req, res) => {
  const { Email, password, confirmPassword } = req.body;

  // Check if password is at least 7 characters long
  if (password.length < 7) {
    return res.render("signup", { error: "Password must be at least 7 characters long." });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render("signup", { error: "Passwords do not match." });
  }

  // If validations pass, insert data into MongoDB and render 'home'
  const data = { Email, password };
  await collection.insertMany([data]);

  res.render("home"); // Render 'home' on successful signup
});

app.all("/login", async (req, res) => {
  if (req.method === "GET") {
    res.render("login");
  } else if (req.method === "POST") {
    try {
      const check = await collection.findOne({ Email: req.body.Email });

      if (check.password === req.body.password) {
        res.render("home");
      } else {
        res.send("Wrong Password!" + check.password + " : " + req.body.password);
      }
    } catch {
      res.send("Wrong Details!");
    }
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/login");
});

app.listen(8080, () => {
  console.log("Port Connected at the following website http://localhost:3000/");
});