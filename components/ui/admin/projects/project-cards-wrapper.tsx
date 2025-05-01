import { useCreateTableColumns } from "../../general/data-table-components/create-table-columns";
import { useProjectList } from "@/hooks/general/use-project";
import ProjectCards from "../../general/data-table-components/project-cards";
import { columns } from "./project-columns";
import { ProjectListResponseInterface } from "@/lib/definitions";

export default function Cards({ isArchived }: { isArchived: boolean }) {
  const transformedColumns =
    useCreateTableColumns<ProjectListResponseInterface>(columns, "Projects");

  const { data: projectList, isLoading } =
    useProjectList<ProjectListResponseInterface>({
      isArchived: isArchived,
    });

  if (isLoading) return <p>Loading...</p>;
  if (!projectList) return <>No Projects Yet</>;
  return <ProjectCards columns={transformedColumns} data={projectList} />;
}
