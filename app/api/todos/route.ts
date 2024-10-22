import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://postgres:password@localhost:54321/electric?sslmode=disable",
});

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, completed } = await request.json();
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const client = await pool.connect();
    await client.query("DELETE FROM todos WHERE id = $1", [id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
