"use client";
import { use } from "react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ProjectView from "@/components/ui/admin/projects/project-view";
import { SidebarTrigger } from "@/components/ui/sidebar";
import serverRequestAPI from "@/hooks/server-request";
import { step1Schema } from "@/lib/form-constants/project-constants";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProjectDetailsSchema = z.infer<typeof step1Schema>;

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = use(params);
  const { edit = "false" } = use(searchParams);

  //server request for initial data, pass it to project view then pass the useApiQuery hook as argument.
  const initialData: ProjectDetailsSchema = await serverRequestAPI({
    url: `${API_URL}/projects/${id}`,
    auth: true,
  });

  return (
    <main className="w-full h-auto flex justify-center flex-col">
      <SidebarTrigger
        breadcrumbs={[
          {
            pageName: "Projects",
            href: "/admin/projects",
            active: false,
          },
          {
            pageName: "View Project Details",
            href: `/admin/projects/${id}/view`,
            active: true,
          },
        ]}
      />
      <ProjectView id={id} edit={edit} />
    </main>
  );
}
