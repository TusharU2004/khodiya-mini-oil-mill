'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './login.css';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || '');

      if (res.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('Server error');
    }
  };

  return (
    <div className="login-page hero-section">
      <div className="login-box">
        <div className="logo-container">
          <Image src="/global/logo.png" alt="Khodiyar Oil Mill Logo" width={120} height={70} />
        </div>
        <h2>Admin Login</h2>
        <p className="login-subtitle">Manage your Khodiya Mini Oil Mill site</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}
