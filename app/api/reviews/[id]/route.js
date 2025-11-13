// app/api/reviews/[id]/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET => single review by id
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await createConnection();
    const [rows] = await db.query(
      `SELECT id, reviewer_name, rating, review_text, review_date, created_at, updated_at
       FROM reviews
       WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT => update review by id
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      reviewer_name,
      rating,
      review_text,
      review_date
    } = body;

    // Basic validation (allow partial? here require all fields like your front-end sends)
    if (!reviewer_name || !review_text || typeof rating === 'undefined' || rating === null || !review_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    const db = await createConnection();

    const [result] = await db.query(
      `UPDATE reviews
       SET reviewer_name = ?, rating = ?, review_text = ?, review_date = ?, updated_at = NOW()
       WHERE id = ?`,
      [reviewer_name, numericRating, review_text, review_date, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // return updated record (optional)
    const [rows] = await db.query(`SELECT id, reviewer_name, rating, review_text, review_date, created_at, updated_at FROM reviews WHERE id = ? LIMIT 1`, [id]);

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE => delete review by id
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = await createConnection();

    const [result] = await db.query(`DELETE FROM reviews WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
