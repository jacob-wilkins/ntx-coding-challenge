import Link from "next/link";
import type { Todo } from "@/lib/types";
import { JsonDB, Config } from 'node-json-db';
import prisma from "@/lib/prisma"

export default async function Home() {

  let loadError = false;

  // getting the api data
  try {
    const resp = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!resp.ok) {
        throw new Error(`Failed to fetch data, status: ${resp.status}`);   
    }

    const data: Todo[] = await resp.json();

    // Select three random todos
    const random = data.sort(() => 0.5 - Math.random()).slice(0, 3);

    // return first 3 values
    //todos = data.slice(0, 3);
    await prisma.todoTask.create({
        data: {
            userId: random[0].userId,
            title: random[0].title,
            completed: random[0].completed
        }
    })
    await prisma.todoTask.create({
        data: {
            userId: random[1].userId,
            title: random[1].title,
            completed: random[1].completed
        }
    })
    await prisma.todoTask.create({
        data: {
            userId: random[2].userId,
            title: random[2].title,
            completed: random[2].completed
        }
    })
  } catch (error) {
    console.error("Error fetching todos:", error);
    loadError = true;
  }

  return (
    <>
      {loadError ? (
        <div className="text-center bg-gray-950">
          <h1 className="text-8xl font-bold leading-none">
            <span className="text-pink-500 inline">to</span>
            <span className="text-blue-500 inline">do</span>
          </h1>
          <div className="min-h-screen p-8 flex flex-col items-center text-red-500">
            Failed to load initial data.
          </div>
        </div>
      ) : (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <Link
              href="/todos"
              className="border-4 rounded-x1 border-double px-4 py-2 outline-offset-4 text-2xl animate-pulse"
            >
              Go to the todo list…
            </Link>
          </main>
        </div>
      )}
    </>
  );
}
