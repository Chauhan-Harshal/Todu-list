import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./app.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:7000/api";

  // Fetch Todos
  const loadTodos = async () => {
    const res = await axios.get(`${API}/get`);
    setTodos(res.data);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Todo
  const saveTodo = async () => {
    const { title, description, dueDate } = form;

    if (!title || !description || !dueDate) {
      toast.warn("All fields are required!");
      return;
    }

    if (editingId === null) {
      // Add New
      await axios.post(`${API}/post`, {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        ...form,
        status: "pending",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      toast.success("Todo added!");
    } else {
      // Update Existing
      await axios.put(`${API}/update/${editingId}`, form);
      toast.info("Todo updated!");
      setEditingId(null);
    }

    setForm({ title: "", description: "", dueDate: "" });
    loadTodos();
  };

  // Delete Todo
  const removeTodo = async (id) => {
    await axios.delete(`${API}/delete/${id}`);
    toast.error("Todo removed!");
    loadTodos();
  };

  // Fill Inputs for Editing
  const editTodo = (todo) => {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
    });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="mainContainer">
      <h1>📌 Todo Manager</h1>

      <div className="inputSection">
        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          type="text"
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button onClick={saveTodo}>
          {editingId ? "Update Todo" : "Add Todo"}
        </button>
      </div>

      <div className="todosList">
        {todos.map((todo) => (
          <div key={todo.id} className="todoItem">
            <div className="topRow">
              <span>{todo.time}</span> <div className="line"></div>{" "}
              <span>{todo.date}</span>
            </div>

            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Due: {todo.dueDate}</p>

            <div className="btnGroup">
              <button className="edit" onClick={() => editTodo(todo)}>
                Edit
              </button>
              <button className="delete" onClick={() => removeTodo(todo.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
