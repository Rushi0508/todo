import type { TodoItem } from "@/lib/types";

const BASE_URL = "/api/todos";

const headers = { "Content-Type": "application/json" } as const;

export async function fetchTodos(): Promise<TodoItem[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json() as Promise<TodoItem[]>;
}

export async function createTodo(text: string): Promise<TodoItem> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json() as Promise<TodoItem>;
}

export interface UpdateTodoParams {
  id: string;
  text?: string;
  completed?: boolean;
}

export async function updateTodo(params: UpdateTodoParams): Promise<TodoItem> {
  const res = await fetch(BASE_URL, {
    method: "PATCH",
    headers,
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json() as Promise<TodoItem>;
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(BASE_URL, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete todo");
}
