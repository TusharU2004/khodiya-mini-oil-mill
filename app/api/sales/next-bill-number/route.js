// app/api/purchases/next-bill-number/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

function getFinancialYearString(date = new Date()) {
  // FY runs Apr - Mar: if month >= 3 (April is 3 since JS months 0-based)
  const year = date.getFullYear();
  if (date.getMonth() >= 3) {
    // e.g. 2025 -> "25-26"
    return `${String(year).slice(2)}-${String(year + 1).slice(2)}`;
  } else {
    // before April -> previous FY
    return `${String(year - 1).slice(2)}-${String(year).slice(2)}`;
  }
}

export async function GET() {
  try {
    const db = await createConnection();
    const fy = getFinancialYearString();
    const prefix = `KOM/${fy}/`;

    // Get last bill for this FY
    const [rows] = await db.query(
      `SELECT bill_no FROM sales WHERE bill_no LIKE ? ORDER BY id DESC LIMIT 1`,
      [`${prefix}%`]
    );

    let nextNumber = 1;
    if (rows.length > 0) {
      const last = rows[0].bill_no;
      const lastNum = parseInt(last.split('/').pop(), 10);
      if (!isNaN(lastNum)) nextNumber = lastNum + 1;
    }

    const formatted = String(nextNumber).padStart(4, '0');
    const newBill = `${prefix}${formatted}`;
    
    return NextResponse.json({ billNo: newBill });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
