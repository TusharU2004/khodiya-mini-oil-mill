// app/components/Features.js

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
            <h2 className="section-title">Why Choose Khodiyar Oil Mill</h2>
        <div className="feature-box">
          <div className="icon"><i className="fa-solid fa-leaf"></i></div>
          <h3>Traditional Steam Heating</h3>
          <p>Natural oil extracted by heating groundnuts with steam.</p>
        </div>
        <div className="feature-box">
          <div className="icon"><i className="fa-solid fa-check-circle"></i></div>
          <h3>100% Pure & Natural</h3>
          <p>No chemicals, no compromise.</p>
        </div>
        <div className="feature-box">
          <div className="icon"><i className="fa-solid fa-users"></i></div>
          <h3>50000+ Happy Customers</h3>
          <p>Trusted by families across Gujarat.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;