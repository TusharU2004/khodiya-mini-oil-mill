// app/api/messages/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query(
      `SELECT id, name, email, contact, subject, message_text, status, created_at, updated_at
       FROM contact_messages
       ORDER BY id DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, contact = null, subject = null, message_text } = body;

    if (!name || !email || !message_text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await createConnection();
    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, contact, subject, message_text, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, contact, subject, message_text]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
