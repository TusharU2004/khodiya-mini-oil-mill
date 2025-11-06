// app/components/layout/Header.js
'use client'; // This must be a client component to use state

import { useState } from 'react'; // Import useState
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './NavLinks';

const Header = () => {
  // State to manage the mobile menu's visibility
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link href="/" className="nav-logo" onClick={() => setIsOpen(false)}>
            <Image src="/global/logo.png" alt="Khodiyar Oil Mill Logo" width={100} height={60} />
          </Link>

          {/* Navigation links for desktop, hidden on mobile */}
          <ul className={isOpen ? "nav-menu active" : "nav-menu"} onClick={() => setIsOpen(false)}>
            <NavLinks color="dark" />
          </ul>

          {/* Hamburger menu button, hidden on desktop */}
          <button 
            className={isOpen ? "hamburger active" : "hamburger"} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;