"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, PlusCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const db = usePGlite();

  const items = useLiveQuery<Todo>(
    `
    SELECT *
    FROM todos
    ORDER BY id DESC
  `
  );

  const insertItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const todo = newTodo.trim();
    if (todo) {
      await db.query("INSERT INTO todos (title, completed) VALUES ($1, $2);", [
        todo,
        false,
      ]);
      setNewTodo("");
    }
  };

  const deleteItem = async (id: number) => {
    await db.query("DELETE FROM todos WHERE id = $1", [id]);
  };

  const updateItem = async (id: number, completed: boolean) => {
    await db.query("UPDATE todos SET completed = $1 WHERE id = $2", [
      completed,
      id,
    ]);
  };

  return (
    <div className="max-w-xl w-full mx-auto overflow-hidden">
      <h1 className="p-6 text-2xl font-bold text-center">local-first to-dos</h1>
      <div className="p-6">
        <form onSubmit={insertItem} className="flex mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow mr-4"
          />
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-primary-foreground"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            Add
          </Button>
        </form>
        <div
          className="overflow-y-auto max-h-[70vh]"
          style={{ scrollbarWidth: "thin" }}
        >
          <AnimatePresence initial={false}>
            {items?.rows.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 pl-5 mb-2 bg-background border border-border rounded-md hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center flex-grow mr-2 overflow-hidden">
                  <motion.button
                    onClick={() => {
                      updateItem(todo.id, !todo.completed);
                    }}
                    className={cn(
                      "flex-shrink-0 mr-3 w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ease-in-out",
                      todo.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground"
                    )}
                    whileTap={{ scale: 0.9 }}
                  >
                    {todo.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  <span
                    className={cn(
                      "text-sm truncate",
                      todo.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {todo.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    deleteItem(todo.id);
                  }}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove todo</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
