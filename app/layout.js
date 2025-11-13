import Script from "next/script";
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
            <body>
                {/* Google Analytics - gtag.js */}
                <Script
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-D87L8S86DV"
                />
                <Script
                    id="google-analytics-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-D87L8S86DV');
                        `,
                    }}
                />
                {children}
            </body>
        </html>
    );
}