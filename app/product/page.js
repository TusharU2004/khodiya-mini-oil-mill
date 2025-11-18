import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Products from "../home/Products"; // Reusing your existing component
import Hero from "../home/Hero";

const ProductPage = () => {
  return (
    <>
      <Header />
      <main>
        {/* We can reuse the component you already built for the homepage */}
        <Products />
      </main>
      <Footer />
    </>
  );
};

export default ProductPage;