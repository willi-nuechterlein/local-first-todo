"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, PlusCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-xl w-full mx-auto overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-primary to-secondary-foreground">
        <h1 className="text-2xl font-bold text-primary-foreground text-center">
          Todo List
        </h1>
      </div>
      <div className="p-6">
        <form onSubmit={addTodo} className="flex mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow mr-2 bg-secondary"
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            Add
          </Button>
        </form>
        <div
          className="h-[300px] overflow-y-auto pr-2"
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
                className="flex items-center justify-between p-3 mb-2 bg-background border border-border rounded-md hover:bg-secondary/80 transition-colors"
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
