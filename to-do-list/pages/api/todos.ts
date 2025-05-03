import prisma from "@/lib/prisma";
import { Todo } from "@/lib/types"
import { NextApiRequest, NextApiResponse } from "next";

interface CreateTodoRequestBody {
    title: string;
    userId: number;
    completed: boolean;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {    // create new todo task (CREATE)

        const { title, userId, completed }: CreateTodoRequestBody = req.body;
        const newTodo: Todo = await prisma.todoTask.create({
            data: { 
                userId, 
                title, 
                completed },
        });
        res.status(201).json(newTodo);
    } else if (req.method === "GET") {  // get existing todo tasks (READ)

        const todos: Todo[] = await prisma.todoTask.findMany();

        res.json(todos);
    } else if (req.method == "PUT"){    // put data into existing todo task (UPDATE)

        const id: number = parseInt(req.query.id as string);
        const { title, completed }: {title?: string; completed?: boolean} = req.body; // Extract the title from the request body

        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        // if title update, then check if title is good
        if (completed === undefined && title !== undefined) {
            if (!title || title.trim() === "") {
                return res.status(400).json({ error: "Title is required and cannot be empty" });
            }
        }

        try {
            const todo: Todo = await prisma.todoTask.update({
                where: {
                    id: id, // Convert the ID to a number
                },
                data: {
                    ...(title !== undefined && {title}),    // Update the title if possible
                    ...(completed !== undefined && {completed}),    // Update completed if possible
                },
            });

            res.status(200).json(todo); // Return the updated todo
        } catch (error) {
            console.log("Error updating todo:", error); // Log the error
            res.status(500).json({ error: `Failed to update todo with ID ${id}` });
        }

    } else if (req.method === "DELETE") {   // get rid of existing todo task (DELETE)

        const id: number = parseInt(req.query.id as string);

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: "ID is required" });
        }

        try {
            await prisma.todoTask.delete({
                where: { 
                    id: id
                },
            });

            res.status(204).end(); // No content to return, just the code
        } catch (error) {
            console.log("Error deleting todo:", error);
            res.status(500).json({ error: `Failed to delete todo with ID ${id}` });
        }
    } else {    // other request that dont work
        res.status(405).json({ error: "Method not allowed" });
    }
}