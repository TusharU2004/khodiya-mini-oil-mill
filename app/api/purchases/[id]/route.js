// app/api/purchases/[id]/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await createConnection();

    // Fetch purchase master
    const [masters] = await db.query(
      `SELECT id, party_name, purchase_date, bill_no, voucher_no, payment_type, subtotal, discount, grand_total, remarks, created_at
       FROM purchases WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
      [id]
    );
    if (masters.length === 0) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }
    const master = masters[0];

    // Fetch items
    const [items] = await db.query(
      `SELECT id, purchase_id, product_id, quantity, rate, packing, amount, created_at
       FROM purchase_items WHERE purchase_id = ? AND deleted_at IS NULL ORDER BY id ASC`,
      [id]
    );

    // Return combined object (frontend expects items: [...])
    return NextResponse.json({
      ...master,
      items
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    const db = await createConnection();

    // compute subtotal and grand_total
    const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.rate) || 0), 0);
    const grandTotal = Number((subtotal - (Number(discount) || 0)).toFixed(2));

    // Update purchases row
    await db.query(
      `UPDATE purchases SET party_name=?, purchase_date=?, bill_no=?, voucher_no=?, payment_type=?, subtotal=?, discount=?, grand_total=?, remarks=?, updated_at=NOW()
       WHERE id = ?`,
      [partyName, purchaseDate, billNo, voucherNo, paymentType, subtotal, discount || 0, grandTotal, remarks, id]
    );

    // Delete existing items (soft delete or hard delete? We'll hard delete rows to simplify)
    // If you prefer soft delete, replace with UPDATE purchase_items SET deleted_at = NOW() WHERE purchase_id = ?
    await db.query('DELETE FROM purchase_items WHERE purchase_id = ?', [id]);

    // Insert new items
    const inserts = items.map(it => {
      const qty = Number(it.quantity) || 0;
      const rate = Number(it.rate) || 0;
      const amount = Number((qty * rate).toFixed(2));
      return db.query(
        `INSERT INTO purchase_items (purchase_id, product_id, quantity, rate, packing, amount, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [id, it.product_id, qty, rate, it.packing || null, amount]
      );
    });
    await Promise.all(inserts);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Missing purchase ID' }, { status: 400 });
    }

    const db = await createConnection();

    await db.query('UPDATE purchase_items SET deleted_at = NOW() WHERE purchase_id = ?', [id]);
    await db.query('UPDATE purchases SET deleted_at = NOW() WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
