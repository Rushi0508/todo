export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface DayGroup {
  date: string;
  items: TodoItem[];
}

export interface TodoStore {
  items: TodoItem[];
}

export type TodoFilter = "all" | "pending" | "completed";
