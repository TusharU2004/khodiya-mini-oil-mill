// app/api/purchases/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET => list purchases (exclude soft deleted)
export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query(
      `SELECT id, party_name, purchase_date, bill_no, voucher_no, payment_type, subtotal, discount, grand_total, remarks, created_at
       FROM purchases
       WHERE deleted_at IS NULL
       ORDER BY id DESC`
    );
    console.log(rows);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST => create purchase + items
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      partyName,
      purchaseDate,
      billNo,
      voucherNo = null,
      paymentType = 'credit',
      remarks = null,
      items,
      discount = 0
    } = body;

    if (!partyName || !billNo || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await createConnection();

    // Ensure bill_no is unique (basic guard)
    const [existing] = await db.query('SELECT id FROM purchases WHERE bill_no = ? LIMIT 1', [billNo]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Bill number already exists' }, { status: 400 });
    }

    // compute subtotal and grand_total
    const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.rate) || 0), 0);
    const grandTotal = Number((subtotal - (Number(discount) || 0)).toFixed(2));

    const [result] = await db.query(
      `INSERT INTO purchases 
        (party_name, purchase_date, bill_no, voucher_no, payment_type, subtotal, discount, grand_total, remarks, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [partyName, purchaseDate, billNo, voucherNo, paymentType, subtotal, discount || 0, grandTotal, remarks]
    );

    const purchaseId = result.insertId;

    // Insert items
    const itemPromises = items.map(it => {
      const qty = Number(it.quantity) || 0;
      const rate = Number(it.rate) || 0;
      const amount = Number((qty * rate).toFixed(2));
      return db.query(
        `INSERT INTO purchase_items (purchase_id, product_id, quantity, rate, packing, amount, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [purchaseId, it.product_id, qty, rate, it.packing || null, amount]
      );
    });

    await Promise.all(itemPromises);

    return NextResponse.json({ success: true, id: purchaseId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
