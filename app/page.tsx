import About from "@/components/ui/homepage/about";
import Hero from "@/components/ui/homepage/hero";
import Navbar from "@/components/ui/homepage/navbar";
import Process from "@/components/ui/homepage/process";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Hero />
      <About />
      <Process />
    </main>
  );
}
