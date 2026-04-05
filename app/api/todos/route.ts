import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAllTodos, addTodo, updateTodo, deleteTodo } from "@/lib/storage";

export async function GET() {
  const items = await getAllTodos();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { text: string };
  const item = await addTodo({
    id: nanoid(),
    text: body.text,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id: string;
    text?: string;
    completed?: boolean;
  };

  const updates: Record<string, unknown> = {};
  if (body.text !== undefined) updates.text = body.text;
  if (body.completed !== undefined) {
    updates.completed = body.completed;
    updates.completedAt = body.completed ? new Date().toISOString() : null;
  }

  const updated = await updateTodo(body.id, updates);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { id: string };
  const deleted = await deleteTodo(body.id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
