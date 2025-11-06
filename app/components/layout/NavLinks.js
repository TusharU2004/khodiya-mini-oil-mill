"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = ({ color = "dark" }) => {
  const pathname = usePathname(); // ✅ get current URL path

  // Base class for all links
  const baseClass = color === "light" ? "nav-link nav-link-light" : "nav-link";

  // Function to check active path
  const isActive = (path) =>
    path === "/"
      ? pathname === "/"
      : pathname.startsWith(path);

  return (
    <>
      <li className="nav-item">
        <Link
          href="/"
          className={`${baseClass} ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link
          href="/product"
          className={`${baseClass} ${isActive("/product") ? "active" : ""}`}
        >
          Product
        </Link>
      </li>

      <li className="nav-item">
        <Link
          href="/process"
          className={`${baseClass} ${isActive("/process") ? "active" : ""}`}
        >
          Our Process
        </Link>
      </li>

      <li className="nav-item">
        <Link
          href="/about"
          className={`${baseClass} ${isActive("/about") ? "active" : ""}`}
        >
          About
        </Link>
      </li>

      {/* <li className="nav-item">
        <Link
          href="/blogs"
          className={`${baseClass} ${isActive("/blogs") ? "active" : ""}`}
        >
          Blogs
        </Link>
      </li> */}

      <li className="nav-item">
        <Link
          href="/contact"
          className={`${baseClass} ${isActive("/contact") ? "active" : ""}`}
        >
          Contact Us
        </Link>
      </li>
    </>
  );
};

export default NavLinks;
