import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="hero-section">
      <Image
        src="/global/hero-image.png"
        alt="Pure and Healthy Groundnut Oil"
        fill={true}
        priority={true}
        className="hero-background-image"
      />
      {/* This div is the dark overlay for better text readability */}
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>Pure & Healthy Groundnut Oil</h1>
        <p>
          Our groundnut oil is crafted using a traditional steam heating method,
          ensuring it is 100% pure, chemical-free, and packed with natural
          nutrition for a healthier life.
        </p>
        <Link href="/product" className="btn">
          ➔ ORDER NOW
        </Link>
      </div>
    </section>
  );
};

export default Hero;