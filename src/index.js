const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not exists" });
  }

  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  const user = {
    name,
    username,
    id: uuidv4(),
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { todos } = request.user;

  return response.status(200).json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { todos } = request.user;

  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body;
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Deu ruim" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { todos } = request.user;
  const { id } = request.params;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Deu ruim" });
  }

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { todos } = request.user;
  const { id } = request.params;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Not Found" });
  }

  todos.splice(todoIndex, 1);

  return response.status(204).send("alou");
});

module.exports = app;
