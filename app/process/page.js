import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Image from 'next/image'; // Make sure to import the Image component
import Hero from "../home/Hero";

// We'll manage the content in an array to keep the code clean
const processSteps = [
  {
    step: 1,
    title: "Sourcing Quality Groundnuts",
    description: "Our process begins at the source. We buy only good quality groundnuts directly from local farmers.",
    imgSrc: "/process/step-1.png", // Add your image here
    imgAlt: "A farmer holding fresh groundnuts"
  },
  {
    step: 2,
    title: "Cleaning the Groundnuts",
    description: "The sourced groundnuts are thoroughly cleaned to remove any impurities, ensuring only the best seeds move to the next stage.",
    imgSrc: "/process/step-2.png", // Add your image here
    imgAlt: "Cleaned groundnuts in a basket"
  },
  {
    step: 3,
    title: "Traditional Steam Extraction",
    description: "We apply the required amount of steam to the cleaned seeds. This traditional and gentle method allows the oil to be extracted without high heat or chemicals.",
    imgSrc: "/process/step-3.png", // Add your image here
    imgAlt: "Steam rising from a traditional oil press"
  },
  {
    step: 4,
    title: "Cotton Cloth Filtering",
    description: "The extracted oil undergoes its first filtration through a clean cotton cloth to remove larger particles and solids.",
    imgSrc: "/process/step-4.png", // Add your image here
    imgAlt: "Golden oil being filtered through a white cloth"
  },
  {
    step: 5,
    title: "Final Filtration",
    description: "To ensure maximum purity and a crystal-clear final product, the oil is filtered one last time.",
    imgSrc: "/process/step-5.png", // Add your image here
    imgAlt: "Close-up of clear, pure groundnut oil"
  },
  {
    step: 6,
    title: "Hygienic Packaging",
    description: "Finally, the pure groundnut oil is packed into our 1L bottles, 5L cans, and 15Kg tins, ready for your kitchen.",
    imgSrc: "/process/step-6.png", // Add your image here
    imgAlt: "Final packaged products of Khodiyar Oil Mill"
  },
];

const ProcessPage = () => {
  return (
    <>
      <Header />
      <main className="process-section">
        <div className="container">
          <p className="subtitle">
            From the farm to your family, we ensure purity at every step.
          </p>
          <div className="process-steps">
            {processSteps.map((item) => (
              <div className="step" key={item.step}>
                <div className="step-image">
                  <Image src={item.imgSrc} alt={item.imgAlt} width={500} height={400} />
                </div>
                <div className="step-text">
                  <h3>Step {item.step}: {item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProcessPage;