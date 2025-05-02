"use client";

// standard react stuff
import { useEffect, useState } from "react";
import getData from "@/lib/getData";

export default function Todos() {
  const [todos, setTodos] = useState<
    { userId: number; id: number; title: string; completed: boolean }[]
  >([]);

  // used for loading buffer text
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodos() {
      const data = await getData();
      setTodos(data);
      setLoading(false);
    }
    fetchTodos();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
