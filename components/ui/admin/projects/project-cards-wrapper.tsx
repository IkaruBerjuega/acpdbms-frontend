import ProjectCards from "../../general/data-table-components/project-cards";
import { ProjectComponentProps } from "@/lib/definitions";

export default function Cards({ columns, projectList }: ProjectComponentProps) {
  if (!projectList) return null;
  return <ProjectCards columns={columns} data={projectList} />;
}
