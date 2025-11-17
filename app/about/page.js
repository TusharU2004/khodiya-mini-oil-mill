import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Image from 'next/image';

const AboutPage = () => {
  return (
    <>
      <Header />
      <main>
        {/* --- Existing About Section --- */}
        <section className="about-section">
          <div className="container">
            <div className="about-header">
              <h2>About Khodiyar Oil Mill</h2>
              <p>
                We are a family-owned business rooted in the traditions of Gujarat, dedicated to providing the purest, most natural groundnut oil to our community.
              </p>
            </div>
            <div className="about-content">
              <div className="about-text">
                <h3>Our Story</h3>
                <p>
                  Khodiyar Oil Mill was born from a simple idea: to bring back the authentic taste and health benefits of traditionally made groundnut oil. In a world of refined and processed foods, we saw a need for an oil that was pure, chemical-free, and made with care.
                </p>
                <h3>Our Mission</h3>
                <p>
                  Our mission is to deliver 100% pure and healthy groundnut oil to every family. We are committed to fair practices, supporting local farmers, and preserving the traditional methods that guarantee the quality of our product.
                </p>
              </div>
              
            </div>
          </div>
        </section>

        {/* ---  Team Section --- */}
        <section className="founders-section">
          <div className="container">
            <h2>Meet Our Team</h2>
            <div className="founders-grid">
              
              <div className="founder-card">
                <Image src="/about/f-1.png" alt="Pareshbhai Umretiya" width={200} height={200} />
                <h3>Pareshbhai Umretiya</h3>
                <h4>Founder</h4>
                <p>
                  With decades of experience in traditional oil milling, Pareshbhai Umretiya ensures that every bottle meets our high standards of purity.
                </p>
              </div>

              <div className="founder-card">
                <Image src="/about/f-2.png" alt="Jayeshbhai Umretiya" width={200} height={200} />
                <h3>Jayeshbhai Umretiya</h3>
                <h4>Founder</h4>
                <p>
                  Jayeshbhai Umretiya oversees our relationships with local farmers, guaranteeing we only source the finest quality groundnuts.
                </p>
              </div>

              {/* --- Son 1 (NEW) --- */}
              <div className="founder-card">
                <Image src="/about/f-3.png" alt="Tushar Umretiya" width={200} height={200} />
                <h3>Tushar Umretiya</h3>
                <h4>Operations & Quality</h4>
                <p>
                  Following in his father's footsteps, Tushar Umretiya brings modern techniques to our traditional process, managing daily operations.
                </p>
              </div>

              {/* --- Son 2 (NEW) --- */}
              <div className="founder-card">
                <Image src="/about/f-4.png" alt="Brijesh Umretiya" width={200} height={200} />
                <h3>Brijesh Umretiya</h3>
                <h4>Sales & Marketing</h4>
                <p>
                  Brijesh Umretiya is dedicated to sharing the story of our pure groundnut oil and building relationships with our valued customers.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;