"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ProjectFormSchemaType,
  ProjectUpdateRequest,
} from "@/lib/form-constants/project-constants";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  MapPin,
  Building,
  User,
  FileText,
  Home,
  Map,
} from "lucide-react";
import Image from "next/image";
import FormInput from "@/components/ui/general/form-components/form-input";
import { BtnDialog } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "./data-table-components/create-table-columns";
import { toast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathname, useRouter } from "next/navigation";
import {
  Phase,
  ProjectDetailsInterface,
  TeamMemberDashboard,
  TeamMemberDashboardResponse,
} from "@/lib/definitions";
import {
  useCheckViceManagerPermission,
  useEditProject,
  useGetActivePhases,
  useGetArchivedPhases,
  useProjectActions,
  useTeamDetailsForDashboard,
  useViewProject,
} from "@/hooks/general/use-project";
import { AiOutlineMail, AiOutlineTeam } from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  getInitialsFallback,
  requireError,
  statusNoticeConfig,
  titleCase,
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import {
  MdOutlineMarkEmailRead,
  MdOutlinePhoneEnabled,
  MdPhoneEnabled,
  MdSecurity,
} from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { LiaTasksSolid } from "react-icons/lia";
import { FaCrown } from "react-icons/fa6";
import { Checkbox } from "../checkbox";
import Profile from "./profile";
import {
  LuCalendarCheck,
  LuCalendarMinus,
  LuCalendarPlus,
} from "react-icons/lu";
import { StatusNotice } from "../hover-card";

interface ProjectDetails {
  id: string;
  edit: string;
  projectDetailsInitialData: ProjectDetailsInterface;
  isAdmin?: boolean;
}

function ProjectDetails<T>({
  id,
  edit,
  projectDetailsInitialData,
  isAdmin = true,
}: ProjectDetails) {
  const [isHovered, setHovered] = useState<boolean>(false);

  const methods = useForm<ProjectFormSchemaType>({
    mode: "onBlur",
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = methods;

  const { paramsKey, params } = useQueryParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isEdit = paramsKey["edit"] === "true";

  const closeEdit = () => {
    params.delete("edit");
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    replace(newUrl);
  };

  const handleEdit = () => {
    params.set("edit", "true");
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    replace(newUrl);
  };

  const queryClient = useQueryClient();

  const { project: projectDetails } = useViewProject(id);
  const { editDetails, uploadPhoto } = useEditProject(id);

  const processForm: SubmitHandler<ProjectUpdateRequest> = async (data) => {
    const body = {
      project_title: data.project_title,
      project_description: data.project_description,
      start_date: data.start_date,
      end_date: data.end_date,
      street: data.street,
      city_town: data.city_town,
      state: data.state,
      zip_code: String(data.zip_code),
    };

    editDetails.mutate(body, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: "Update Project Details",
          description: response.message || "Upload Photo Successful",
        });
        closeEdit();
        queryClient.invalidateQueries({ queryKey: ["project-view", id] });
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Update Project Details",
          description:
            response.message || "There was an error processing the request",
        });
      },
    });
  };

  useEffect(() => {
    if (projectDetails) {
      reset({
        client_id: projectDetails.client_id,
        client_name: projectDetails.client_name,
        project_description: projectDetails.project_description,
        project_title: projectDetails.project_title,
        start_date: projectDetails.start_date,
        end_date: projectDetails.end_date,
        street: projectDetails.street,
        city_town: projectDetails.city_town,
        state: projectDetails.state,
        finish_date: projectDetails.finish_date,
        zip_code: projectDetails.zip_code,
        status: projectDetails.status,
        image_url: projectDetails.image_url ?? undefined,
      });
    }
  }, [projectDetails, reset]);

  const details = watch();
  const projectLocation = `${projectDetails?.state}, ${projectDetails?.city_town}`;
  const projectDescription = projectDetails?.project_description;
  const title = projectDetails?.project_title;
  const status = projectDetails?.status;
  const image_url =
    projectDetails?.image_url ||
    "https://media.istockphoto.com/id/1217618992/photo/3d-house.jpg?s=612x612&w=0&k=20&c=brVxRkoQX9q-2TwiyjgjYyNJrBCs-j41J34fLVp3pdA=";

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("image", file);

      uploadPhoto.mutate(formData, {
        onSuccess: (response: { message: string }) => {
          toast({
            variant: "default",
            title: "Upload Photo",
            description: response.message || "Upload Photo Successful",
          });
          queryClient.invalidateQueries({ queryKey: ["project-view", id] });
        },
        onError: (response: { message: string }) => {
          toast({
            variant: "destructive",
            title: "Upload Photo",
            description:
              response.message || "There was an error processing the request",
          });
        },
      });
    }
  };

  const phasesIconSrc = "/button-svgs/tasks-header-phases.svg";

  return (
    <Card className="border-none shadow-md  h-fit ">
      <CardContent className="system-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div
              className={`relative h-[125px] w-[125px] rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform ${
                isAdmin && "hover:scale-105"
              }`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <Image
                src={image_url}
                alt="Project"
                width={1000}
                height={1000}
                className="object-cover h-full w-full"
              />
              {isHovered && isAdmin && (
                <div className="absolute inset-0 flex items-center justify-center hover:bg-primary hover:bg-opacity-60">
                  <p className="text-sm text-secondary font-bold">
                    Change Photo
                  </p>
                </div>
              )}

              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-maroon-600 mb-1">
                {title}
              </h1>
              <div className="flex items-center text-slate-600 mb-1">
                <span className="text-sm">{projectDescription}</span>
              </div>
              <div className="flex items-center text-slate-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{projectLocation}</span>
              </div>
              <div className="flex-row-start">
                <Badge
                  className={`${getStatusColor(
                    status ?? "unknown"
                  )} py-1 text-xs font-medium hover:bg-white`}
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>
          {!isEdit && isAdmin && (
            <Button
              className="bg-maroon-600 hover:bg-maroon-700 text-white self-start"
              onClick={handleEdit}
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Details
            </Button>
          )}
        </div>

        <Separator className="my-6" />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(processForm)} className="space-y-6">
            {/* Basic Details Section */}
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-maroon-600 mr-2" />
                <h2 className="font-semibold text-lg text-maroon-600">
                  Basic Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 ml-6 gap-6">
                {isEdit ? (
                  <>
                    <FormInput
                      name="client_name"
                      label="Client Name"
                      inputType="search"
                      validationRules={undefined}
                      register={register}
                      disabled={true}
                    />
                    <FormInput
                      name="project_title"
                      label="Project Title"
                      inputType="default"
                      validationRules={{
                        required: requireError("Project Title"),
                      }}
                      errorMessage={errors.project_title?.message}
                      register={register}
                    />
                    <FormInput
                      name="project_description"
                      label="Project Description"
                      inputType="default"
                      validationRules={{
                        required: requireError("Project Description"),
                      }}
                      errorMessage={errors.project_description?.message}
                      register={register}
                    />
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          Client Name
                        </span>
                      </div>
                      <p className="text-base pl-6">{details?.client_name}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          Project Title
                        </span>
                      </div>
                      <p className="text-base pl-6">{details?.project_title}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          Project Description
                        </span>
                      </div>
                      <p className="text-base pl-6">
                        {details?.project_description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Separator className="bg-primary opacity-20" />
            {/* Location Section */}
            <div>
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-maroon-600 mr-2" />
                <h2 className="font-semibold text-lg text-maroon-600">
                  Project Location
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 ml-6 gap-6">
                {isEdit ? (
                  <>
                    <FormInput
                      name="state"
                      label="State"
                      inputType="default"
                      validationRules={{ required: requireError("State") }}
                      errorMessage={errors.state?.message}
                      register={register}
                    />
                    <FormInput
                      name="city_town"
                      label="City/Town"
                      inputType="default"
                      validationRules={{ required: requireError("City/Town") }}
                      errorMessage={errors.city_town?.message}
                      register={register}
                    />
                    <FormInput
                      name="street"
                      label="Street"
                      inputType="default"
                      validationRules={{ required: requireError("Street") }}
                      errorMessage={errors.street?.message}
                      register={register}
                    />
                    <FormInput
                      name="zip_code"
                      label="Zip Code"
                      inputType="default"
                      register={register}
                      errorMessage={errors.zip_code?.message}
                      validationRules={{ valueAsNumber: true }}
                    />
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Map className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          State
                        </span>
                      </div>
                      <p className="text-base pl-6">{details?.state}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          City/Town
                        </span>
                      </div>
                      <p className="text-base pl-6">{details?.city_town}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          Street
                        </span>
                      </div>
                      <p className="text-base pl-6">{details?.street}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          Zip Code
                        </span>
                      </div>
                      <p className="text-base pl-6">{details?.zip_code}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Separator className="bg-primary opacity-30" />
            {/* Duration Section */}
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-maroon-600 mr-2" />
                <h2 className="font-semibold text-lg text-maroon-600">
                  Project Duration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 ml-6 gap-6">
                {isEdit ? (
                  <>
                    <FormInput
                      name="start_date"
                      label="Start Date"
                      inputType="date"
                      control={control}
                      validationRules={{
                        required: requireError("Start Date"),
                        validate: (value: string) => {
                          if (!value) return "Start Date is required";
                          const selectedDate = new Date(value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          // Check if date is valid
                          if (isNaN(selectedDate.getTime())) {
                            return "Invalid date format";
                          }

                          return (
                            selectedDate > today ||
                            "Start Date must be in the future"
                          );
                        },
                      }}
                      errorMessage={errors.start_date?.message}
                    />

                    <FormInput
                      name="end_date"
                      label="End Date"
                      inputType="date"
                      control={control}
                      validationRules={{
                        required: requireError("End Date"),
                        validate: (value: string) => {
                          const selectedDate = new Date(value);
                          const startDateValue = watch("start_date");

                          if (!startDateValue) return true; // Wait for start date to be filled
                          const startDate = new Date(startDateValue);

                          // Check if dates are valid
                          if (
                            isNaN(selectedDate.getTime()) ||
                            isNaN(startDate.getTime())
                          ) {
                            return "Invalid date format";
                          }

                          return (
                            selectedDate > startDate ||
                            "End Date must be later than Start Date"
                          );
                        },
                      }}
                      errorMessage={errors.end_date?.message}
                    />
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          Start Date
                        </span>
                      </div>
                      <p className="text-base pl-6">
                        {details?.start_date ? details.start_date : ""}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                          End Date
                        </span>
                      </div>
                      <p className="text-base pl-6">
                        {details?.end_date ? details.end_date : ""}
                      </p>
                    </div>
                    {projectDetails?.finish_date && (
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar
                            className={"h-4 w-4 text-emerald-500 mr-2"}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            Finish Date
                          </span>
                        </div>
                        <p className="text-base pl-6">
                          {details?.finish_date ? details.finish_date : ""}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {isEdit && (
              <div className="flex justify-end gap-3 ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => closeEdit()}
                  className="border-slate-300"
                >
                  Cancel
                </Button>
                <BtnDialog
                  dialogDescription="Do you confirm to update this project's details?"
                  dialogTitle="Edit Project Details"
                  variant="default"
                  submitType="submit"
                  submitTitle="Submit"
                  btnTitle="Save Details"
                  onClick={handleSubmit(processForm)}
                  className="bg-maroon-600 hover:bg-maroon-700 text-white"
                  alt={"edit project save button"}
                />
              </div>
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

//team details
function Member({
  props,
  hasPermission,
  toggleVicePermission,
}: {
  props: TeamMemberDashboard;
  hasPermission?: boolean;
  toggleVicePermission?: () => void;
}) {
  const isProjectManager = props.role === "Project Manager";
  const isViceManager = props.role === "Vice Manager";
  const isManager = isProjectManager || isViceManager;

  return (
    <Card className="">
      <CardContent className="p-6 min-h-[200px] shadow-md border-none flex-col-between-start">
        <div className="mb-5 w-full">
          <div>
            <div className="flex-row-start-center gap-2 ">
              <Profile
                profileName={props.full_name}
                profileSrc={props.profile_picture_url}
                isProjectManager={isProjectManager}
                isViceManager={isViceManager}
                variant="base"
              />
              <div className="flex-col-start">
                <div className="flex-row-start-center gap-2">
                  <p className="text-sm">{props.full_name}</p>
                  {props.has_task && (
                    <StatusNotice
                      noticeColor={
                        statusNoticeConfig["in progress"].noticeColor
                      }
                      content={"Has Ongoing Tasks"}
                    />
                  )}
                </div>

                <p className="text-xs text-slate-500">{props.role}</p>
              </div>
            </div>
            <Separator className="my-2" />{" "}
            <div className="flex items-center">
              <AiOutlineMail className="h-4 w-4 text-slate-500 mr-2" />
              <span className="text-sm font-medium text-slate-700">
                {props.email}
              </span>
            </div>
            <div className="flex items-center">
              <MdOutlinePhoneEnabled className="h-4 w-4 text-slate-500 mr-2" />
              <span className="text-sm font-medium text-slate-700">
                {props.phone_number}
              </span>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full text-slate-500">
          <AccordionItem value="item-1 space-y-0">
            <AccordionTrigger className="text-sm ">
              <div className="flex-row-start gap-2">
                <LiaTasksSolid className="text-base" />
                <span>Task Counts</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex-col-start gap-1 w-full px-2">
              <div className="flex-row-between-center w-full">
                <span>To Do: </span>
                <span className="font-semibold">
                  {props.task_counts["to do"]}
                </span>
              </div>
              <div className="flex-row-between-center w-full">
                <span>In Progress: </span>
                <span className="font-semibold">
                  {props.task_counts["in progress"]}
                </span>
              </div>
              <div className="flex-row-between-center w-full">
                <span>Needs Review: </span>
                <span className="font-semibold">
                  {props.task_counts["needs review"]}
                </span>
              </div>
              <div className="flex-row-between-center w-full">
                <span>Paused: </span>
                <span className="font-semibold">
                  {props.task_counts.paused}
                </span>
              </div>
              <div className="flex-row-between-center w-full">
                <span>Done: </span>
                <span className="font-semibold">{props.task_counts.done}</span>
              </div>
              <div className="flex-row-between-center w-full">
                <span>Cancelled: </span>
                <span className="font-semibold">
                  {props.task_counts.cancelled}
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
          {isViceManager && (
            <AccordionItem value="item-2 space-y-0">
              <AccordionTrigger className="text-sm ">
                <div className="flex-row-start gap-2">
                  <MdSecurity className="text-base" />
                  <span>Permission</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex-col-start gap-1 w-full px-2">
                <div className="flex-row-between-center ">
                  <span>Vice Manager Permission </span>
                  <Checkbox
                    checked={hasPermission}
                    onClick={toggleVicePermission}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function TeamMembers({
  id,
  teamInitialData,
}: {
  id: string;
  teamInitialData: TeamMemberDashboardResponse;
}) {
  const { data, isLoading } = useTeamDetailsForDashboard(id);
  const { data: hasPermission } = useCheckViceManagerPermission(id);
  const { toggleVicePermission } = useProjectActions(id);

  const queryClient = useQueryClient();

  const handletoggleVicePermission = () => {
    toggleVicePermission.mutate(null, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: "Toggle Vice Permission",
          description:
            response.message || "Vice Permission Toggled Successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["project-vice-permission", id],
        });
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Toggle Vice Permission",
          description:
            response.message || "There was an error processing the request",
        });
      },
    });
  };

  const teamMembers = data?.team_members;

  const projectManager = teamMembers?.find(
    (member) => member.role === "Project Manager"
  );

  const viceManager = teamMembers?.find(
    (member) => member.role === "Vice Manager"
  );

  const members = teamMembers?.filter((member) => member.role === "Member");

  if (isLoading) {
    return (
      <Card className="border-none shadow-md w-full h-full ">
        <CardContent className="p-6">loading...</CardContent>
      </Card>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card className="border-none shadow-md w-full h-full">
        <CardContent className="p-6">No members yet</CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-full space-y-2 ">
      <Card className="border-none shadow-md">
        <CardContent className="p-2 ">
          <div className="flex items-center">
            <AiOutlineTeam className="h-5 w-5 text-maroon-600 mr-2" />
            <h2 className="font-semibold text-lg text-maroon-600">Team</h2>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-2">
        {projectManager && <Member props={projectManager} />}
        {viceManager && (
          <Member
            props={viceManager}
            hasPermission={hasPermission?.vice_manager_permission}
            toggleVicePermission={handletoggleVicePermission}
          />
        )}
        {members?.map((member, index) => {
          return <Member key={index} props={member} />;
        })}
      </div>
    </div>
  );
}

function PhasesMapping({
  phases,
  phasesIconSrc,
  isActive,
}: {
  phases: Phase[] | undefined;
  phasesIconSrc: string;
  isActive: boolean;
}) {
  const title = isActive ? "Active Phases" : "Archived Phases";

  return (
    <div className="flex-col-start  mx-6 ">
      <div className="flex-col-start  gap-4">
        <Badge
          className={`flex items-center w-fit text-xs ${
            isActive
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          } `}
        >
          {title}
        </Badge>

        {phases && (
          <div className="grid grid-cols-2 w-full gap-4">
            {phases?.map((phase) => {
              return (
                <div
                  key={phase.id}
                  className="system-padding border-[1px] col-span-1 rounded-md"
                >
                  <div className="flex-row-start-center gap-2">
                    <Image
                      width={16}
                      height={16}
                      alt="phases-icon"
                      src={phasesIconSrc}
                    />
                    <span className="text-base font-medium text-slate-700">
                      {titleCase(phase.category)}
                    </span>

                    <StatusNotice {...statusNoticeConfig[phase.status]} />
                  </div>
                  <div className="ml-6 mt-2 text-sm text-slate-500">
                    <div className="flex-row-start-center gap-2">
                      <LuCalendarPlus className="text-base" />
                      <span>{phase?.created_at?.toString().slice(0, 10)}</span>
                    </div>
                    {phase.finish_date && (
                      <div className="flex-row-start-center gap-2">
                        <LuCalendarCheck className="text-base" />
                        <span>
                          {phase?.finish_date?.toString().slice(0, 10)}
                        </span>
                      </div>
                    )}
                    {phase.status === "archived" && (
                      <div className="flex-row-start-center gap-2">
                        <LuCalendarMinus className="text-base" />
                        <span>
                          {phase?.updated_at?.toString().slice(0, 10)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {phases?.length === 0 && (
          <div className="text-sm ml-6 text-slate-500">No {title}</div>
        )}
      </div>
    </div>
  );
}

function Phases({ id }: { id: string }) {
  const phasesIconSrc = "/button-svgs/tasks-header-phases.svg";

  const { data: activePhases } = useGetActivePhases(id);
  const { data: archivedPhases } = useGetArchivedPhases(id);

  return (
    <Card className="shadow-md h-fit border-none ">
      <CardContent className="p-6 flex-col-start gap-4">
        <div className="flex-row-start-center gap-2">
          <Image width={20} height={20} alt="phases-icon" src={phasesIconSrc} />
          <h2 className="font-semibold text-lg text-maroon-600">
            Project Phases
          </h2>
        </div>
        <div className="w-full flex-col-start gap-8">
          <PhasesMapping
            phases={activePhases}
            phasesIconSrc={phasesIconSrc}
            isActive={true}
          />
          <PhasesMapping
            phases={archivedPhases}
            phasesIconSrc={phasesIconSrc}
            isActive={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectView({
  id,
  edit,
  projectDetailsInitialData,
  teamInitialData,
  isAdmin = true,
}: {
  id: string;
  edit: string;
  projectDetailsInitialData: ProjectDetailsInterface;
  teamInitialData: TeamMemberDashboardResponse;
  isAdmin?: boolean;
}) {
  return (
    <div className="flex flex-row-start gap-2  min-h-0 overflow-y-auto relative transition-all duration-200 overflow-visible ">
      <div className="w-[75%] space-y-2  h-full overflow-visible ">
        <ProjectDetails
          id={id}
          edit={edit}
          projectDetailsInitialData={projectDetailsInitialData}
          isAdmin={isAdmin}
        />
        <Phases id={id} />
      </div>
      <div className="flex-grow h-full ">
        <TeamMembers id={id} teamInitialData={teamInitialData} />
      </div>
    </div>
  );
}
