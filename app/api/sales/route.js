import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

// GET all sales
export async function GET() {
  try {
    const db = await createConnection();
    const [rows] = await db.query(`
      SELECT * FROM sales WHERE deleted_at IS NULL ORDER BY id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new sale
export async function POST(req) {
  try {
    const data = await req.json();
    const db = await createConnection();

    const {
      party_name,
      party_mobile,
      party_address,
      sales_date,
      bill_no,
      voucher_no,
      payment_type,
      subtotal,
      discount,
      grand_total,
      remarks,
      items
    } = data;

    const [result] = await db.query(
      `INSERT INTO sales 
        (party_name, party_mobile, party_address, sales_date, bill_no, voucher_no, payment_type, subtotal, discount, grand_total, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [party_name, party_mobile, party_address, sales_date, bill_no, voucher_no, payment_type, subtotal, discount, grand_total, remarks]
    );

    const saleId = result.insertId;

    if (items && items.length > 0) {
      const values = items.map(item => [
        saleId,
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

    return NextResponse.json({ success: true, id: saleId });
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
