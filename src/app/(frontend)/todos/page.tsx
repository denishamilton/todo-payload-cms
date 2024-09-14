// app/page.tsx
'use client'; // Используем client-side rendering

import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  updatedAt: string;
  createdAt: string;
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние формы
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCompleted, setNewTodoCompleted] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/todos`);
        setTodos(response.data.docs);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            `Error: ${err.response.status} - ${err.response.statusText}`
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // Пустой массив зависимостей, чтобы эффект выполнился только при монтировании

  // Обработчик отправки формы
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/todos`, {
        title: newTodoTitle,
        completed: newTodoCompleted,
      });
      console.log('New Todo created:', response.data); // Проверка ответа от сервера

      // Обновляем список Todos
      const response2 = await axios.get(`${apiUrl}/todos`);
      setTodos(response2.data.docs);

      setNewTodoTitle(''); // Очищаем поле ввода
      setNewTodoCompleted(false); // Сбрасываем статус
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  // Обработчик удаления Todo
  const handleDelete = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${apiUrl}/todos/${id}`);

      // Обновляем список Todos после удаления
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  // Обработчик изменения статуса Todo
  const handleToggleCompleted = async (id: number, completed: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.patch(`${apiUrl}/todos/${id}`, {
        completed: !completed,
      });

      // Обновляем список Todos после изменения статуса
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Link href="/">Home</Link>

      <div className="bg-gray-100 border border-gray-400 shadow-xl shadow-gray-300 rounded-xl  border-black p-4">
        <h2 className="text-2xl bg-green-200 p-4">Todos</h2>
        <div className="grid grid-cols-4 bg-gray-500 p-4 text-white">
          <div>ID</div>
          <div>Completed</div>
          <div>Title</div>
          <div>Delete</div>
        </div>
        {todos.map((todo) => (
          <div className="grid grid-cols-4 pt-2 pb-2 pl-4 pr-4" key={todo.id}>
            <div>{todo.id}</div>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo.id, todo.completed)}
              />
            </div>
            <div>{todo.title}</div>
            <button
              className="bg-red-500 text-white"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2>Add New Todo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Enter Todo Title:
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input
              type="checkbox"
              checked={newTodoCompleted}
              onChange={(e) => setNewTodoCompleted(e.target.checked)}
            />
          </label>
        </div>
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
