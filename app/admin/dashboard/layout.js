// File: app/admin/layout.js
'use client';
import React, { useState, useEffect, cloneElement, Children } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './dashboard.css'; // Make sure this path is correct

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-container">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="main-content">
        <Header onMenuClick={toggleSidebar} />
        <main>{children}</main>
      </div>
    </div>
  );
}