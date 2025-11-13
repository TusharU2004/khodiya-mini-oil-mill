// app/api/reviews/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET => list reviews
export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query(
      `SELECT id, reviewer_name, rating, review_text, review_date, created_at, updated_at
       FROM reviews
       ORDER BY id DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST => create review
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      reviewer_name,
      rating,
      review_text,
      review_date
    } = body;

    // Basic validation
    if (!reviewer_name || !review_text || typeof rating === 'undefined' || rating === null || !review_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    const db = await createConnection();

    const [result] = await db.query(
      `INSERT INTO reviews
        (reviewer_name, rating, review_text, review_date, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [reviewer_name, numericRating, review_text, review_date]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
