// app/components/Video.js

const Video = () => {
  return (
    <section className="video-section text-center">
      <div className="container">
        <h2>The Original Taste of Groundnut Oil</h2>
        <p>At Khodiyar Mini Oil Mill, purity is our promise. We extract oil the traditional way — using steam-heating — without any chemicals or hidden additives.</p>
        <div className="video-placeholder">
          {/* IMPORTANT: Go to your video on YouTube, click Share > Embed, and paste the iframe code here */}
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/YkjOuYP8wjc?si=DnxtWv5OFryYcHPP"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Video;