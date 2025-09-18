import Desc from "@/components/Desc";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer"
import SVGBackground from "@/components/ui/SVGBackground";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <SVGBackground />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <Hero />
        <Desc />
        <Footer />
      </div>
    </div>
  );
}
