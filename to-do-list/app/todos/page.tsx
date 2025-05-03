import TodoList from "@/components/TodoList";
import prisma from "@/lib/prisma"

export default async function TodosPage() {

    const todos = await prisma.todoTask.findMany();

    return (
        <div className="text-center bg-gray-950">
            <h1 className="text-8xl font-bold leading-none space-y-0 space-x-0">
                <span className="text-pink-500 inline">to</span>
                <span className="text-blue-500 inline">do</span>
            </h1>

            <TodoList initialTodos={todos} />

        </div>
    );
}