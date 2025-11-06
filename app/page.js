// app/page.js

// Updated imports from the new folder structure
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./home/Hero";
import Features from "./home/Features";
import Video from "./home/Video";
import Products from "./home/Products";
import Testimonials from "./home/Testimonials";
import Map from "./home/Map";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Video />
        <Products />
        <Testimonials />
        <Map />
      </main>
      <Footer />
    </>
  );
}