"use client";   // forgot what this is for, need to look this up

// standard react stuff
import { useEffect, useState } from "react";
import type { Todo } from "@/lib/types";
import { CheckCircle, PencilSimpleLine, Trash } from "phosphor-react";


interface TodoListProps {
    initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
    const [items, setItems] = useState<Todo[]>(initialTodos); // changing todos list
    const [input, setInput] = useState("");   // used for setting titles and editing titles
    const [editModal, setEditModal] = useState<Todo | null>(null);  // for the popup modal
    const [error, setError] = useState("");       // used for error handling
    const [isError, setIsError] = useState(false);  // also used for error handling
    const [filter, setFilter] = useState("all");  // filters the table

    useEffect(() => {
      if (isError) {
        const timer = setTimeout(() => {
          setIsError(false);
        }, 5500);                    // hide after 3 seconds
        return () => clearTimeout(timer); // cleanup if unmounted early
      }
    }, [isError]);

    // makes the edit modal visible
    const openModal = (todo: Todo) => {
      setEditModal(todo);
      setInput(todo.title);
    }

    // makes the edit modal hidden
    const closeModal = () => {
      setEditModal(null);
      setInput("");
    }

    // changes the filter based on the dropdown box
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilter(event.target.value);
    }

    // filters todos based on the current filter
    const filteredItems = items.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  
    const handleCreateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        createTodo();
      }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    };

    // changes state of the checkbox nex to each entry
    const toggle = async (id: number) => {
      // find the todo item to update
      const todo = items.find((item) => item.id === id);
      if (!todo) return;

      try{
        const res = await fetch(`/api/todos?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }, // Add JSON header
          body: JSON.stringify({ type: toggle, completed: !todo.completed }),
        });

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(`${errorData.error}`);
        }

        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          )
        );
      } catch (error) {
        console.error("Completion toggle failed: " + error);
        setError("Failed to toggle todo task with ID " + id);
        setIsError(true);
        return;
      };
    };

    // removes todo from the list
    const remove = async (id: number) => {
      try {
        const res = await fetch(`/api/todos?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error(`Failed to delete todo with ID ${id}`);

        // update list in real time
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch(error) {
        console.error("Delete failed: ", error);
        setError(`Failed to delete todo with ID ${id}`);
        setIsError(true);
      }
    };

    // update existing todo task
    const saveEdit = async () => {
      // only when the editing modal is open
      if (editModal) {
        // if there is nothing in the text box when clicked
        if (!input.trim()) {
          setError("Error: textbox should not be empty when editting");
          closeModal();
          setIsError(true);
          setInput("");
          return;
        }
        try{
          const res = await fetch(`/api/todos?id=${editModal.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, // Add JSON header
            body: JSON.stringify({ title: input }),
          });

          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(`${errorData.error}`);
          }

          // update the list in real time
          setItems((prev) =>
            prev.map((item) =>
              // look in the todos array for the matching todo item
              // when found, change the title to the input variable
              item.id === editModal.id ? { ...item, title: input } : item
            )
          );
          closeModal();

        } catch(error) {
          console.error("Update failed: ", error);
          closeModal();
          setError(`Failed to update todo with ID ${editModal.id}`);
          setIsError(true);
        }
      }
    };

    // creates a new todo list item
    const createTodo = async () => {
      // if there is nothing in the text box when clicked
      if (!input.trim()) {
        setError("Error: textbox should not be empty when submitting");
        setIsError(true);
        setInput("");
        return;
      }

      setError("");
      setIsError(false);

      try {
        const res = await fetch('/api/todos', {
          method: 'POST',                                            // POST method :contentReference[oaicite:9]{index=9}
          headers: { 'Content-Type': 'application/json' },           // set JSON header :contentReference[oaicite:10]{index=10}
          body: JSON.stringify({ title: input, userId: 1 , completed: false}),                             // serialize body :contentReference[oaicite:11]{index=11}
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const created: Todo = await res.json();                     // parse JSON response :contentReference[oaicite:12]{index=12}
        setItems(prev => [...prev, created]);                       // update UI state
        setInput('');
      } catch (err) {
        console.error('Create failed:', err);
        setError("Failed to create todo");
        setIsError(true);
      }
    }

    return (
      <div className="min-h-screen p-8 flex flex-col items-center">

        {isError &&
          (
            <div>
              <span className=" text-red-500 border-2 py-2 px-4 fadeOut">{error}</span>
            </div>
          )
        }
        {/* ——— Form ——— */}
        <div className="w-full max-w-3xl flex gap-2 mb-8 pt-4">
          <input
            type="text"
            id="newTodo"
            value={input}
            placeholder="Add a new task..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCreateKeyDown}
            className="
              flex-1
              px-4 py-3
              bg-gray-800 placeholder-gray-500
              border border-gray-700
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
          <button
            onClick={createTodo}
            className="
              px-6 py-3
              bg-blue-500 hover:bg-blue-600
              text-white font-semibold
              rounded-lg
              transition
            "
          >
            Create
          </button>
        </div>
    
        {/* ——— Counters ——— */}
        <div className="w-full max-w-3xl flex justify-between mb-4 text-sm">
          <span className="text-pink-400 font-bold">
            Tasks created{' '}
            <span className="bg-gray-700 text-white px-2 rounded-full">
              {items.length}
            </span>
          </span>
          <select name="sort" id="sort" className="bg-gray-950 text-grey-300 rounded text-center" value={filter} onChange={handleFilterChange}>
            <option value="all">Show all</option>
            <option value="active">Show active</option>
            <option value="completed">Show completed</option>
          </select>
          <span className="text-blue-400 font-bold">
            Completed{' '}
            <span className="bg-gray-700 text-white px-2 rounded-full">
              {items.filter((t) => t.completed).length} of {items.length}
            </span>
          </span>
        </div>
    
        {/* ——— Todo List ——— */}
        <ul className="w-full max-w-3xl space-y-3">
          {filteredItems.map((todo) => (
            <li
              key={todo.id}
              className="
                bg-gray-700
                rounded-lg
                p-4
                flex items-center justify-between
              "
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggle(todo.id)}
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center
                    transition-colors duration-200
                    ${todo.completed
                      ? 'bg-blue-400 text-white'
                      : 'border-2 border-pink-400 text-transparent'}
                  `}
                >
                  {todo.completed && (
                    <CheckCircle size={16} weight="bold" />
                  )}
                </button>
                <span
                  className={`
                    flex-1 break-words text-balance break-words break-all text-left w-full
                    ${todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-100'}
                  `}
                >
                  {todo.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openModal(todo)}
                  className="text-blue-400 hover:text-blue-500 transition"
                >
                  <PencilSimpleLine size={18} />
                </button>
                <button
                  onClick={() => remove(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </li>
          ))}
        </ul>
    
        {/* ——— Edit Modal ——— */}
        {editModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-white mb-4">
                Edit Task
              </h2>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="
                  w-full p-2 mb-4
                  bg-gray-700 text-white
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="
                    px-4 py-2 bg-gray-600 hover:bg-gray-700
                    text-white rounded-lg transition
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="
                    px-4 py-2 bg-blue-500 hover:bg-blue-600
                    text-white rounded-lg transition
                  "
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
