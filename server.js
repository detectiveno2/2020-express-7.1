// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ todos: [] }).write();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/todos", (req, res) => {
  res.render("todos/index", {
    todos: db.get('todos').value(),
  });
});

app.get("/todos/search", (req, res) => {
  let q = req.query.q;
  let todos = db.get('todos').value();
  console.log(todos);
  let matchedTodos = todos.filter(todo => {
    return todo.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render("todos/index", {
    todos: matchedTodos,
    queryInput: q
  });
});

app.post("/todos/create", (req, res) => {
  let newTodo = req.body;
  db.get('todos').push(newTodo).write();
  res.redirect("back");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
