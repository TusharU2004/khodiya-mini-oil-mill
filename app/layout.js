// app/layout.js

import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configure fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
  title: "Khodiyar Oil Mill - Pure & Healthy Groundnut Oil",
  description: "Pure and natural groundnut oil sourced directly from farmers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      {/* Add this script tag for Font Awesome icons */}
      <head>
        <script
          src="https://kit.fontawesome.com/your-kit-code.js"
          crossOrigin="anonymous"
          async
        ></script>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}