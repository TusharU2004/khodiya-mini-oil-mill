// app/api/messages/[id]/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await createConnection();
    const [rows] = await db.query(
      `SELECT id, name, email, contact, subject, message_text, status, created_at, updated_at
       FROM contact_messages WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT -> update (we'll allow marking status read/unread or editing subject/message)
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, email, contact, subject, message_text, status } = body;

    // Basic check: at least one field must be provided
    if (
      typeof name === 'undefined' &&
      typeof email === 'undefined' &&
      typeof contact === 'undefined' &&
      typeof subject === 'undefined' &&
      typeof message_text === 'undefined' &&
      typeof status === 'undefined'
    ) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }

    const db = await createConnection();

    // Build dynamic set clause
    const updates = [];
    const values = [];
    if (typeof name !== 'undefined') { updates.push('name = ?'); values.push(name); }
    if (typeof email !== 'undefined') { updates.push('email = ?'); values.push(email); }
    if (typeof contact !== 'undefined') { updates.push('contact = ?'); values.push(contact); }
    if (typeof subject !== 'undefined') { updates.push('subject = ?'); values.push(subject); }
    if (typeof message_text !== 'undefined') { updates.push('message_text = ?'); values.push(message_text); }
    if (typeof status !== 'undefined') { updates.push('status = ?'); values.push(status); }

    values.push(id);
    const sql = `UPDATE contact_messages SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const [rows] = await db.query('SELECT * FROM contact_messages WHERE id = ? LIMIT 1', [id]);
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = await createConnection();
    const [result] = await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
