"use client";   // forgot what this is for, need to look this up

// standard react stuff
import { useEffect, useState } from "react";
import type { Todo } from "@/lib/types";

interface TodoListProps {
    initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
    const [items, setItems] = useState<Todo[]>(initialTodos); // changing todos list
    const [editTitle, setEditTitle] = useState("");           // editing title of todo
    const [newTitle, setNewTitle] = useState("");           // creating a new todo
    const [editModal, setEditModal] = useState<Todo | null>(null);  // for the popup modal

    // makes the edit modal visible
    const openModal = (todo: Todo) => {
      setEditModal(todo);
      setEditTitle(todo.title);
    }

    // makes the edit modal hidden
    const closeModal = () => {
      setEditModal(null);
      setEditTitle("");
    }

    // changes state of the checkbox nex to each entry
    const toggle = (id: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    };

    // removes todo from the list
    const remove = (id: number) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const saveEdit = () => {
      // only when the editing modal is open
      if (editModal) {
        setItems((prev) =>
          prev.map((item) =>
            // look in the todos array for the matching todo item
            // when found, change the title to the editTitle variable
            item.id === editModal.id ? { ...item, title: editTitle } : item
          )
        );
        closeModal();
      }
    };

    // creates a new todo list item
    const createTodo = () => {
      // if there is nothing in the text box when clicked
      if (!newTitle.trim()) return;

      // create the actual object
      const newTodo: Todo = {
        userId: 1,
        id: Date.now(),
        title: newTitle,
        completed: false
      }

      // put it into the list
      setItems((prev) => [...prev, newTodo]);

      // make title empty again so the text field is reset
      setNewTitle("");
    }

    return (
      <>
      <div>
          <input 
            type="text"
            id="newTodo"
            value={newTitle}
            placeholder="Add a new todo item..."
            onChange={(e) => setNewTitle(e.target.value)}
            >
          </input>
          <button onClick={createTodo}>Create</button>
      </div>
      <ul className="space-y-2">
        {items.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 w-full p-2 mb-4 bg-gray-700 text-white rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id)}
            />
            <span>{todo.title}</span>
            <button onClick={() => openModal(todo)}>Edit</button>
            <button onClick={() => remove(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Edit Todo
            </h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    );
}
