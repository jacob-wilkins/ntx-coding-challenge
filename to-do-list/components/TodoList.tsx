"use client";   // forgot what this is for, need to look this up

// standard react stuff
import { useEffect, useState } from "react";
import type { Todo } from "@/lib/types";
// at the top of your component file
import { CheckCircle, PencilSimpleLine, Trash } from "phosphor-react";


interface TodoListProps {
    initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
    const [items, setItems] = useState<Todo[]>(initialTodos); // changing todos list
    const [editTitle, setEditTitle] = useState("");           // editing title of todo
    const [newTitle, setNewTitle] = useState("");           // creating a new todo
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
      if (!newTitle.trim()) {
        setError("Error: textbox should not be empty when submitting");
        setIsError(true);
        return;
      }

      setError("");
      setIsError(false);

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
            value={newTitle}
            placeholder="Add a new task..."
            onChange={(e) => setNewTitle(e.target.value)}
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
                Editar Tarefa
              </h2>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
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
