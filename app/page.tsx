"use client";

import About from "@/components/ui/homepage/about";
import ContactForm from "@/components/ui/homepage/contact-form";
import Footer from "@/components/ui/homepage/footer";
import Hero from "@/components/ui/homepage/hero";
import Navbar from "@/components/ui/homepage/navbar";
import Process from "@/components/ui/homepage/process";
import RecentProjects from "@/components/ui/homepage/recent-projects";
import { useAdminSettings } from "@/hooks/general/use-admin-settings";

export default function Page() {
  const { logoQuery, contactDetailsQuery, recentImagesQuery } =
    useAdminSettings();

  const logoUrl =
    logoQuery?.data?.logo_url ||
    "/system-component-images/logo-placeholder.webp";

  const contactDetails = contactDetailsQuery?.data?.contact_details || [];

  const recentProjectImages =
    recentImagesQuery?.data?.recent_project_images || [];

  const isLoading =
    logoQuery.isLoading ||
    contactDetailsQuery.isLoading ||
    recentImagesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex-col-center w-full h-screen text-base text-slate-600">
        Loading...
      </div>
    );
  }

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
