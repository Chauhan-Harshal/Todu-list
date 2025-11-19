import express from "express";
import cors from "cors"
const app = express();
const Port = 5000;

app.use(express.json())
app.use(cors())

const Todos = [
  {
    id: 1,
    title: "Complete reading Page",
    description: "Implement dark mode toggle and optimize components",
    status: "in-progress",
    dueDate: "2025-11-11",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  },
];

// data fetch
app.get("/api/get", (req, res) => {
  res.json(Todos);
});

// add new data
app.post("/api/post", (req, res) => {
  Todos.push(req.body);
  res.json(Todos);
});

// update data
app.put("/api/update/:id", (req, res) => {
  const todoID = req.params.id;
  const updatedData = req.body;

  const todo = Todos.find((t) => t.id == todoID);
  if (todo) {
    Object.assign(todo, updatedData);
    res.json({
      message: "Todo data updated successfully !",
      UpdatedTodo: todo,
    });
  } else {
    res.status(404).send("User not found !");
  }
});

//delete data
app.delete("/api/delete/:id", (req, res) => {
  const todoID = req.params.id;
  const index = Todos.findIndex((t) => t.id == todoID);
  if (index !== 1) {
    Todos.splice(index, 1);
    res.json({
      message: "Todo data deleted successfully !",
      remainingTodos: Todos,
    });
  } else {
    res.status(404).send("User not found !");
  }
});

app.listen(Port, () => {
  console.log("Server is started on PORT http://localhost:" + Port);
});