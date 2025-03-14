import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "./general/data-table-components/create-table-columns";

import { flexRender } from "@tanstack/react-table";
import {
  ProjectDetailsInterface,
  ProjectListResponseInterface,
} from "@/lib/definitions";

export default function Card({
  row,
  fn,
  data,
}: {
  data?: ProjectListResponseInterface;
  row?: any;
  isClient?: boolean;
  fn?: (projectId?: string, projectName?: string) => void;
}) {
  let actionsCell;

  if (row?.getAllCells) {
    actionsCell = row
      .getAllCells()
      .find((cell: { column: { id: string } }) => cell.column.id === "actions");
  }

  const id = data?.id ?? row?.getValue("id");
  const projectTitle = data?.project_title ?? row?.getValue("project_title");
  const projectImgSrc =
    // data?.image_url ??
    // row?.getValue("image_url") ??
    "/system-component-images/project-src-placeholder.webp";

  const status = data?.status ?? row?.getValue("status");
  const clientName = data?.client_name ?? row?.getValue("client_name");
  const startDate = data?.start_date ?? row?.getValue("start_date");
  const endDate = data?.end_date ?? row?.getValue("end_date") ?? "N/A";
  const finishedDate =
    data?.finish_date ?? row?.getValue("finish_date") ?? undefined;
  const location = data?.location ?? row?.getValue("location") ?? "N/A";
  const role = data?.user_role;

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
      onClick={() => {
        if (fn) {
          fn(id, projectTitle);
        }
      }}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* {row.getValue('image_url') ? ( */}
        {projectImgSrc && (
          <Image
            src={projectImgSrc}
            alt={`${projectTitle} Project`}
            className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
            width={1000}
            height={1000}
            draggable={false}
            priority
          />
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex-row-start gap-2">
          <Badge
            className={`${getStatusColor(
              status
            )} px-2 py-1 text-xs font-medium`}
          >
            {status}
          </Badge>

          {role && (
            <Badge className={` px-2 py-1 text-xs font-medium`}>
              Role: {role}
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-maroon-700 group-hover:text-maroon-800">
              {projectTitle}
            </h3>
            <div className="flex items-center text-slate-500 mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <p className="text-sm line-clamp-1">{location}</p>
            </div>
          </div>

          {!data && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="ml-2 rotate-90"
            >
              {actionsCell
                ? flexRender(
                    actionsCell.column.columnDef.cell,
                    actionsCell.getContext()
                  )
                : null}
            </div>
          )}
        </div>

        <div className="mt-1 space-y-2 flex-grow">
          <div className="flex items-start">
            <User className="h-4 w-4 text-slate-400 mt-0.5 mr-2" />
            <div>
              <p className="text-xs text-slate-500">Client</p>
              <p className="text-sm font-medium">{clientName}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5 mr-2" />
            <div>
              <p className="text-xs text-slate-500">Timeline</p>
              <p className="text-sm">
                {startDate} - {endDate}
              </p>
            </div>
          </div>

          {finishedDate && (
            <div className="flex items-start">
              <Calendar className="h-4 w-4 text-emerald-500 mt-0.5 mr-2" />
              <div>
                <p className="text-xs text-slate-500">Completed</p>
                <p className="text-sm">{finishedDate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
