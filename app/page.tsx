"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, PlusCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openDB } from "idb";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * Creates and initializes the IndexedDB database for the Todo application.
 *
 * @constant {Promise<IDBDatabase>} dbPromise - A promise that resolves to the opened database.
 *
 * This constant initializes a connection to an IndexedDB database named "TodoApp".
 * It sets up the database structure with version 1, creating an object store named "todos".
 *
 * @property {function} upgrade - Callback function to set up the database schema.
 * @param {IDBDatabase} db - The database instance to be upgraded.
 */
const dbPromise = openDB("TodoApp", 1, {
  upgrade(db) {
    // Creates an object store named "todos" with auto-incrementing IDs
    db.createObjectStore("todos", { keyPath: "id", autoIncrement: true });
  },
});

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    const db = await dbPromise;
    const tx = db.transaction("todos", "readonly");
    const store = tx.objectStore("todos");
    const items = await store.getAll();
    setTodos(items);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const db = await dbPromise;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    await store.add({ text: newTodo, completed: false });
    await tx.done;

    setNewTodo("");
    loadTodos();
  }

  async function toggleTodo(id: number) {
    const db = await dbPromise;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    const todo = await store.get(id);
    await store.put({ ...todo, completed: !todo.completed });
    await tx.done;

    loadTodos();
  }

  async function removeTodo(id: number) {
    const db = await dbPromise;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    await store.delete(id);
    await tx.done;

    loadTodos();
  }

  return (
    <div className="max-w-xl w-full mx-auto overflow-hidden">
      <h1 className="p-6 text-2xl font-bold text-center">
        Local-first Todos
      </h1>
      <div className="p-6">
        <form onSubmit={addTodo} className="flex mb-6">
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
            {todos?.map((todo) => (
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
                    onClick={() => toggleTodo(todo.id)}
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
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTodo(todo.id)}
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
