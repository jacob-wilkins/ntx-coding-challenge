"use client";   // forgot what this is for, need to look this up

// standard react stuff
import { useEffect, useState } from "react";
import type { Todo } from "@/lib/types";

interface TodoListProps {
    initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
    const [items, setItems] = useState<Todo[]>(initialTodos);

    // changes state of the checkbox nex to each entry
    const toggle = (id: number) => {
        setItems((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      };
    
      return (
        <ul className="space-y-2">
          {items.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo.id)}
              />
              <span>{todo.title}</span>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      );
}
