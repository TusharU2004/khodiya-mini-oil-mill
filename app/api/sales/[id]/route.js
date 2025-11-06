import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

// GET single sale with items
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const db = await createConnection();

    const [sales] = await db.query(`SELECT * FROM sales WHERE id = ? AND deleted_at IS NULL`, [id]);
    const [items] = await db.query(`SELECT * FROM sales_items WHERE sale_id = ? AND deleted_at IS NULL`, [id]);

    if (!sales.length) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({ ...sales[0], items });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update sale)
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const data = await req.json();
    const db = await createConnection();

    const {
      party_name,
      party_mobile,
      party_address,
      sale_date,
      bill_no,
      voucher_no,
      payment_type,
      subtotal,
      discount,
      grand_total,
      remarks,
      items
    } = data;

    await db.query(
      `UPDATE sales SET
        party_name=?, party_mobile=?, party_address=?, sale_date=?, bill_no=?, voucher_no=?, 
        payment_type=?, subtotal=?, discount=?, grand_total=?, remarks=?
       WHERE id=?`,
      [party_name, party_mobile, party_address, sale_date, bill_no, voucher_no,
       payment_type, subtotal, discount, grand_total, remarks, id]
    );

    // delete old items (soft delete)
    await db.query(`UPDATE sale_items SET deleted_at = NOW() WHERE sale_id = ?`, [id]);

    // insert new items
    if (items && items.length > 0) {
      const values = items.map(item => [
        id,
        item.product_id,
        item.quantity,
        item.rate,
        item.packing,
        item.amount
      ]);
      await db.query(
        `INSERT INTO sale_items (sale_id, product_id, quantity, rate, packing, amount)
         VALUES ?`,
        [values]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE (soft delete)
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const db = await createConnection();

    await db.query(`UPDATE sale_items SET deleted_at = NOW() WHERE sale_id = ?`, [id]);
    await db.query(`UPDATE sales SET deleted_at = NOW() WHERE id = ?`, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
