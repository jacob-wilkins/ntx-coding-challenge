import type { Todo } from "@/lib/types"
import TodoList from "@/components/TodoList"

export default async function TodosPage() {
    let todos: Todo[] = []; // holds all of the todos from api
    let loadError = false;  // used for showing the error or not

    // getting the api data
    try {
        const resp = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!resp.ok) {
            throw new Error(`Failed to fetch todos, status: ${resp.status}`);   
        }

        const data: Todo[] = await resp.json();

        // looked up algorithm to shuffle this json: Fisher-Yates Shuffle
        // I could've imported something to do this, but it felt unnessary
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }

        // return first 3 values
        todos = data.slice(0, 3);
    } catch (error) {
        console.error("Error fetching todos:", error);
        loadError = true;
    }

    return (
        <div className="min-h-screen p-8 grid grid-rows-[auto_1fr_auto] gap-8">
            <h1 className="text-3xl font-bold">todo</h1>

            {loadError ? (<div className="text-red-500">Failed to load initial todos.</div>) : (<TodoList initialTodos={todos} />)}

        </div>
    );
}