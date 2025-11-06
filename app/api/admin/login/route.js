// app/api/admin/login/route.js
import { createConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log('Login request:', email, password);

    const db = await createConnection();

    const [rows] = await db.query(
      `SELECT users.*, roles.name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.email = ? 
       LIMIT 1`,
      [email]
    );

    console.log('Query result:', rows);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    // Plain password check (change to bcrypt if hashed)
    if (user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 0) {
      return NextResponse.json({ message: 'Account inactive' }, { status: 403 });
    }

    if (user.name !== 'admin') {
      return NextResponse.json({ message: 'Access denied. Not an admin' }, { status: 403 });
    }

    console.log('✅ Admin login success:', user.email);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.name,
      },
    });

  } catch (err) {
    console.error('🔥 Login API Error:', err.message);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
