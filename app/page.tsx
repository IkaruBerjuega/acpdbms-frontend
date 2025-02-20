import About from "@/components/ui/homepage/about";
import ContactForm from "@/components/ui/homepage/contact-form";
import Footer from "@/components/ui/homepage/footer";
import Hero from "@/components/ui/homepage/hero";
import Navbar from "@/components/ui/homepage/navbar";
import Process from "@/components/ui/homepage/process";
import RecentProjects from "@/components/ui/homepage/recent-projects";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Process />
      <RecentProjects />
      <ContactForm />
      <Footer />
    </main>
  );
}
