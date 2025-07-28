import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import WhyImages from "../components/WhyImages";
import WhyCorpDocs from "../components/WhyCorpDocs";

function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhyImages />
        <WhyCorpDocs />
      </main>
      <Footer/>
    </div>
  );
}

export default Landing;
