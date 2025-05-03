import Link from "next/link";
import type { Todo } from "@/lib/types";
import { JsonDB, Config } from 'node-json-db';

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="/todos" className="border-4 rounded-x1 border-double px-4 py-2 outline-offset-4 text-2xl animate-pulse">Go to the todo list...</Link>
      </main>
    </div>
  );
}
