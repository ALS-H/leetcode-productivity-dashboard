import React, { useEffect, useState } from "react";
import "../styles/Todo.css";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

export default function TodoList() {
  const { user, token } = useAuth(); // ✅ include token
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchTodos();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API}/api/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch todos: ${res.status}`);
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("❌ Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!task.trim() || !token || !user) return;

    try {
      const res = await fetch(`${API}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      const data = await res.json();
      setTodos([data, ...todos]);
      setTask("");
    } catch (err) {
      console.error("❌ Add todo failed:", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await fetch(`${API}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!res.ok) throw new Error("Failed to toggle complete");

      const data = await res.json();
      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error("❌ Toggle complete failed:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API}/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // 🔐 Prevent unauthorized UI
  if (!user || !token) {
    return <div className="todo-section">Please log in to use your todo list.</div>;
  }

  if (loading) return <div className="todo-section">Loading your todos...</div>;

  return (
    <div className="todo-section">
      <h2>Todo List</h2>
      <div className="todo-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />
            <span className={todo.completed ? "completed" : ""}>{todo.task}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
