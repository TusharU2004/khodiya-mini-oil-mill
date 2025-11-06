import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// --- Fetch all products ---
export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- Add new product ---
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const db = await createConnection();
    const [result] = await db.query('INSERT INTO products (name) VALUES (?)', [name]);
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- Update product ---
export async function PUT(req) {
  try {
    const { id, name } = await req.json();
    if (!id || !name) return NextResponse.json({ error: 'ID & Name required' }, { status: 400 });

    const db = await createConnection();
    await db.query('UPDATE products SET name = ? WHERE id = ?', [name, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- Delete product ---
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = await createConnection();
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
