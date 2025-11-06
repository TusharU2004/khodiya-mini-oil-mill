import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './NavLinks'; // Import the new component

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-col">
                    <Link href="/" className="footer-logo">
                        <Image src="/global/logo.png" alt="Khodiyar Oil Mill Logo" width={100} height={70} />
                    </Link>
                    <p>Pure & Natural Groundnut Oil, Sourced Directly from Farmers</p>
                </div>
                <div className="footer-col">
                    <h4>Navigation</h4>
                    <ul className="nav-footer">
                        <NavLinks color="light" />
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Address</h4>
                    <p>Khodiyar Oil Mill, Motavadala,<br /> Kalavad, Jamnagar, Gujarat - 361162</p>
                    <h4>Contact</h4>
                    <p>
                        <a href="tel:7043169204" style={{ color: 'inherit', textDecoration: 'none' }}> 7043169204 (9 AM to 6 PM) </a>
                        <br />
                        <a href="mailto:tusharumretiya@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                            tusharumretiya@gmail.com
                        </a>
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright © 2025 | Khodiyar Oil Mill</p>
                <div className="social-icons">
                    <a href="https://wa.me/917043169204"><i className="fab fa-whatsapp"></i></a>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;