'use client';
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, XCircle, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Header = ({ onMenuClick }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    showToast('Logout successful!', 'success');
    setTimeout(() => router.push('/admin/login'), 1000);
  };

  // ✅ Toast function to show messages
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <>
      <header className="admin-header">
        <div className="header-left">
          <button className="menu-toggle-btn" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <h1>Admin Dashboard</h1>
        </div>

        <div className="profile-menu-container" ref={dropdownRef}>
          <button
            className="profile-icon-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User size={24} />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <User size={20} /> Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                <LogOut size={20} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ✅ Toast Notification */}
      {toast.show && (
        <div
          className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
};

export default Header;
