import { useEffect, useState } from "react";
import axios from "axios";
import './TodoList.css';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

enum TodoView {
  All,
  Completed,
  Uncompleted,
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[] | null>([]);
  const [todoView, setTodoView] = useState<TodoView>(TodoView.All);
  const [isMaxTodos, setIsMaxTodos] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:8080/todos')
    .then((response) => {
      setTodos(response.data);
      setIsMaxTodos(response.data >= 10);
    })
    .catch((error) => {
      console.log('Error fetching todos:', error);
      setTodos(null);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxTodos) {
      alert('Cannot add more than 10 todos');
      return;
    }
    if (updatingTodoId) {
      axios.put(`http://localhost:8080/todos?id=${updatingTodoId}`, {
        title,
        description,
        completed: false,
      })
      .then(() => {
        setTitle("");
        setDescription("");
        setUpdatingTodoId(null);
        fetchTodos();
      })
      .catch((error) => {
        console.error('Error updating todo:', error);
      });
    } else {
      axios.post('http://localhost:8080/todos', {
        title,
        description,
        completed: false,
      })
      .then(() => {
        setTitle("");
        setDescription("");
        fetchTodos();
      })
      .catch((error) => {
        console.error('Error creating todo:', error);
      });
    }
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8080/todos?id=${id}`)
    .then(() => {
      fetchTodos();
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
      alert(`Error deleting todo: ${error.message || 'Unknown error'}`);
    });
  };

  const handleUpdate = (todo: Todo) => {
    setUpdatingTodoId(todo.id);
    setTitle(todo.title)
    setDescription(todo.description);
  };

  const handleToggleCompleted = (id: number, completed: boolean) => {
    axios.put(`http://localhost:8080/todos?id=${id}`, {
      completed: !completed,
    })
    .then(() => {
      fetchTodos();
    })
    .catch((error) => {
      console.error('Error updating todo:', error);
    })
  };

  const showAllTodos = () => {
    setTodoView(TodoView.All);
  };

  const showCompletedTodos = () => {
    setTodoView(TodoView.Completed);
  };

  const showUncompletedTodos = () => {
    setTodoView(TodoView.Uncompleted);
  };

  let displayedTodos;
  if (todos) {
    switch (todoView) {
      case TodoView.All:
        displayedTodos = todos;
        break;
      case TodoView.Completed:
        displayedTodos = todos.filter((todo) => todo.completed);
        break;
      case TodoView.Uncompleted:
        displayedTodos = todos.filter((todo) => !todo.completed);
        break;
      default:
        displayedTodos = todos;
    }
  };

return (
  <div className="todo-list">
    <h1>Todo List</h1>
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <button type="submit">{updatingTodoId ? 'Update Todo': 'Add Todo'}</button>
    </form>
    <button onClick={showAllTodos}>Show All Todos</button>
    <button onClick={showCompletedTodos}>Show Completed Todos</button>
    <button onClick={showUncompletedTodos}>Show Uncompleted Todos</button>
    <ul>
      {Array.isArray(displayedTodos) && displayedTodos.map((todo) => (
        <li key={todo.id}>
          <h2>{todo.title}</h2>
          <p>{todo.description}</p>
          <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
          <p>Created at: {todo.created_at}</p>
          <p>Updated at: {todo.updated_at}</p>
          <button className="update-button" onClick={() => handleUpdate(todo)}>Update</button>
          <button className="delete-button" onClick={() => handleDelete(todo.id)}>Delete</button>
          <label>
            Completed:
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo.id, todo.completed)}
            />
          </label>
        </li>
      ))}
    </ul>
  </div>
);
};

export default TodoList;