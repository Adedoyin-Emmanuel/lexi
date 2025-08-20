import Faq from "./components/faq";
import Hero from "./components/hero";
import Footer from "./components/footer";
import Header from "./components/header";
import Features from "./components/features";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
