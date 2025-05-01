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

export default async function Page() {
  const [logoResponse, contactDetailsResponse, recentProjectImagesResponse] =
    await Promise.all([
      serverRequestAPI({ url: "/settings/logo", auth: false }),
      serverRequestAPI({ url: "/contact-details", auth: false }),
      serverRequestAPI({ url: "/recent-projects", auth: false }),
    ]);

  const logoUrl =
    (logoResponse as LogoResponse)?.logo_url ||
    "/system-component-images/logo-placeholder.webp";

  const contactDetails =
    (contactDetailsResponse as DynamicContactSchema)?.contact_details || [];

  const recentProjectImages =
    (recentProjectImagesResponse as RecentProjectsResponse)
      ?.recent_project_images || [];

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
