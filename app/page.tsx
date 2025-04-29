import About from "@/components/ui/homepage/about";
import ContactForm from "@/components/ui/homepage/contact-form";
import Footer from "@/components/ui/homepage/footer";
import Hero from "@/components/ui/homepage/hero";
import Navbar from "@/components/ui/homepage/navbar";
import Process from "@/components/ui/homepage/process";
import RecentProjects from "@/components/ui/homepage/recent-projects";
import serverRequestAPI from "@/hooks/server-request";
import {
  DynamicContactSchema,
  LogoResponse,
  RecentProjectsResponse,
} from "@/lib/definitions";

export default async function Home() {
  const logoResponse: LogoResponse | null =
    (await serverRequestAPI({
      url: "/settings/logo",
      auth: false,
    })) || "/system-component-images/logo-placeholder.webp";

  const contactDetailsResponse: DynamicContactSchema | null =
    await serverRequestAPI({
      url: "/contact-details",
      auth: false,
    });

  const recentProjectImagesResponse: RecentProjectsResponse | null =
    await serverRequestAPI({
      url: "/recent-projects",
      auth: false,
    });

  const logoUrl =
    logoResponse?.logo_url || "/system-component-images/logo-placeholder.webp";

  const contactDetails = contactDetailsResponse?.contact_details || [];

  const recentProjectImages =
    recentProjectImagesResponse?.recent_project_images || [];

  return (
    <main className="relative">
      <Navbar />
      <Hero logoUrl={logoUrl} />
      <About />
      <Process />
      <RecentProjects images={recentProjectImages} />
      <ContactForm />
      <Footer logoUrl={logoUrl} contactDetails={contactDetails} />
    </main>
  );
}
