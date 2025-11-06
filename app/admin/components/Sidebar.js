// File: app/components/Sidebar.js
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, DollarSign, MessageSquare, BarChart2, Package} from 'lucide-react';
import path from 'path';

const Sidebar = ({ isOpen }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/product', icon: <LayoutDashboard size={20} />},
    { name: 'Purchases', path: '/admin/purchases', icon: <ShoppingCart size={20} /> },
    { name: 'Sales', path: '/admin/sales', icon: <DollarSign size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Reports', path: '/admin/reports', icon: <BarChart2 size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        <Image src="/global/logo.png" alt="Logo" width={40} height={40} />
        {isOpen && <h2>Khodiyar Admin</h2>}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`menu-item ${pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            {isOpen && <span className="menu-item-text">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;