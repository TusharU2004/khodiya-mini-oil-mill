import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

// GET all contact messages
export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query(`
      SELECT * FROM contact_messages ORDER BY id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new contact message
export async function POST(req) {
  try {
    const data = await req.json();
    const db = await createConnection();

    const { name, email, contact, subject, reason } = data || {};

    // Basic validation (match style from your sales API)
    if (!name || !email || !contact || !subject) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, contact, subject, message_text)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, contact, subject, reason || null]
    );

    const insertedId = result.insertId;

    return NextResponse.json({ success: true, id: insertedId });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
