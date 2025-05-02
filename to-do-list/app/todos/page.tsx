"use client";   // forgot what this is for, need to look this up

// standard react stuff
import { useEffect, useState } from "react";
import getData from "@/lib/getData";

export default function Todos() {
  // may need to change this later to include a class for the data (Promise??)
  const [todos, setTodos] = useState<
    { userId: number; id: number; title: string; completed: boolean }[]
  >([]);

  // used for loading buffer text
  const [loading, setLoading] = useState(true);

  // runs after component is rendered
  useEffect(() => {
    async function fetchTodos() {
      // get api data
      const data = await getData();

      // update todos map with collected data
      setTodos(data);

      // update loading variable to false
      setLoading(false);
    }
    fetchTodos();
  }, []);   // add empty array at the end to make sure this effect only runs once

  // if loading is true, display temporary text
  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <ul className="space-y-2">
        {/* map over data with the id as the key */}
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
