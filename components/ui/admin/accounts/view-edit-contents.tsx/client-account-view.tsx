"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { BtnDialog, Button } from "@/components/ui/button";
import {
  Edit,
  User,
  MapPin,
  FileText,
  ListChecks,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/ui/general/form-components/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/general/use-profile";
import { ViewEditCard } from "./project-view-card";
import { adminUpdateProfile } from "@/lib/form-constants/form-constants";
import USLocationSelector from "@/components/ui/general/location-selector";

export default function ClientAccView({
  id,
  isEdit,
}: {
  id: string;
  isEdit: boolean;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  // The form type is strictly adminUpdateProfile, so only its fields can be set.
  const methods = useForm<adminUpdateProfile>({
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
    setValue,
  } = methods;

  const {
    profileDetails,
    finishedProjects,
    ongoingProjects,
    updateProfileFromAdminMutation,
  } = useProfile(id);

  // Function to update query parameters without modifying params directly
  const handleEdit = () => {
    const params = new URLSearchParams();
    params.set("edit", "true");
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl);
  };

  const closeEdit = () => {
    const params = new URLSearchParams();
    params.delete("edit");
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl);
  };

  // Populate form with existing values
  useEffect(() => {
    if (profileDetails && profileDetails.client) {
      const defaultValues: adminUpdateProfile = {
        first_name: profileDetails.client.first_name,
        middle_name: profileDetails.client.middle_name || "",
        last_name: profileDetails.client.last_name,
        phone_number: profileDetails.client.phone_number || "",
        street: profileDetails.client.street || "",
        city_town: profileDetails.client.city_town || "",
        state: profileDetails.client.state || "",
        zip_code: profileDetails.client.zip_code || "",
      };
      reset(defaultValues);
    }
  }, [profileDetails, reset]);

  const processForm: SubmitHandler<adminUpdateProfile> = async (data) => {
    updateProfileFromAdminMutation.mutate(data, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: "Notification",
          description:
            response.message || "You successfully updated the account details",
        });
        queryClient.invalidateQueries({ queryKey: ["user-details", id] });
        closeEdit();
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Error!",
          description: response.message || "Update failed. Please try again.",
        });
      },
    });
  };

  const address =
    [
      profileDetails?.client?.street,
      profileDetails?.client?.city_town,
      profileDetails?.client?.state,
      profileDetails?.client?.zip_code,
    ]
      .filter(Boolean)
      .join(", ") || "Not Set";

  const phoneNumber = profileDetails?.client?.phone_number;
  const email = profileDetails?.email || "Not Set";
  const noProfile = "/no-profile.png";

  const [imgSrc, setImgSrc] = useState<string>(
    profileDetails?.profile_picture_url || noProfile
  );

  useEffect(() => {
    setImgSrc(profileDetails?.profile_picture_url || noProfile);
  }, [profileDetails]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(processForm)} className="space-y-8">
                {/* Header / Profile Section */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Profile Image */}
                    <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={imgSrc}
                        alt={`${
                          profileDetails?.client?.first_name || "First Name"
                        } ${
                          profileDetails?.client?.last_name || "Last Name"
                        }'s Image`}
                        quality={100}
                        className="object-cover"
                        fill
                        onError={() => setImgSrc(noProfile)}
                      />
                    </div>
                    {/* Name and Edit Button */}
                    <div className="flex flex-col justify-center">
                      <h1 className="text-2xl font-bold text-primary mb-1">
                        {`${
                          profileDetails?.client?.first_name || "First Name"
                        } ${profileDetails?.client?.last_name || "Last Name"}`}
                      </h1>
                      <div className="text-slate-600 text-sm space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-primary mr-2" />
                          <p>Phone Number: {phoneNumber || "Not Set"}</p>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-primary mr-2" />
                          <p>Address: {address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isEdit && (
                    <Button type="button" onClick={handleEdit} size="sm">
                      <Edit className="text-base mr-2" /> Edit Details
                    </Button>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Personal Details */}
                <div className="flex items-center mb-4">
                  <User
                    className={`h-5 w-5 mr-2 ${
                      isEdit ? "text-maroon-600" : "text-slate-900"
                    }`}
                  />
                  <h2
                    className={`font-semibold text-lg ${
                      isEdit ? "text-maroon-600" : "text-slate-900"
                    }`}
                  >
                    Personal Details
                  </h2>
                </div>

                {isEdit ? (
                  /* Edit Mode */
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                    <FormInput
                      name="first_name"
                      label="First Name"
                      inputType="default"
                      register={register}
                      errorMessage={errors.first_name?.message}
                    />
                    <FormInput
                      name="middle_name"
                      label="Middle Name"
                      inputType="default"
                      register={register}
                      errorMessage={errors.middle_name?.message}
                    />
                    <FormInput
                      name="last_name"
                      label="Last Name"
                      inputType="default"
                      register={register}
                      errorMessage={errors.last_name?.message}
                    />
                    <FormInput
                      name="phone_number"
                      label="Phone Number"
                      inputType="default"
                      register={register}
                      errorMessage={errors.phone_number?.message}
                    />

                    {/* Address */}
                    <div className="lg:col-span-4 col-span-1">
                      <Separator className="my-4" />
                      <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        <h2 className="font-semibold text-lg text-primary">
                          Address
                        </h2>
                      </div>
                    </div>

                    <div className="lg:col-span-3 col-span-1">
                      <USLocationSelector
                        control={control}
                        setValue={setValue}
                        stateFieldName="state"
                        cityFieldName="city_town"
                        zipcodeFieldName="zip_code"
                        onStateChange={(state) =>
                          console.log("State changed:", state)
                        }
                        onCityChange={(city) =>
                          console.log("City changed:", city)
                        }
                        onZipcodeChange={(zipcode) =>
                          console.log("Zipcode changed:", zipcode)
                        }
                      />
                    </div>

                    <div className="lg:col-span-1 col-span-1">
                      <FormInput
                        name="street"
                        label="Street"
                        inputType="default"
                        placeholder="Ex. 123 Sunset Blvd"
                        register={register}
                        required
                      />
                    </div>

                    {/* Other Details (email) */}
                    <div className="lg:col-span-4 col-span-1">
                      <Separator className="my-4" />
                      <div className="flex items-center mb-4">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <h2 className="font-semibold text-lg text-primary">
                          Other Details
                        </h2>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-base text-slate-700">{email}</p>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">First Name</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.first_name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Middle Name</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.middle_name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Last Name</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.last_name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <p className="text-base text-slate-700">
                        {phoneNumber || "Not Set"}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="lg:col-span-4 col-span-1">
                      <Separator className="my-4" />
                      <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-slate-900 mr-2" />
                        <h2 className="font-semibold text-lg text-slate-900">
                          Address
                        </h2>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">State</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.state || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">City/Town</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.city_town || "Not Set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Zip Code</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.zip_code || "Not Set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Street</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.client?.street || "Not Set"}
                      </p>
                    </div>
                    {/* Other Details */}
                    <div className="lg:col-span-4 col-span-1">
                      <Separator className="my-4" />
                      <div className="flex items-center mb-4">
                        <FileText className="h-5 w-5 text-slate-900 mr-2" />
                        <h2 className="font-semibold text-lg text-slate-900">
                          Other Details
                        </h2>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-base text-slate-700">{email}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Ongoing Projects */}
                <div className="flex items-center mb-4">
                  <ListChecks
                    className={`h-5 w-5 mr-2 ${
                      isEdit ? "text-primary" : "text-slate-900"
                    }`}
                  />
                  <h2
                    className={`font-semibold text-lg ${
                      isEdit ? "text-primary" : "text-slate-900"
                    }`}
                  >
                    Ongoing Projects
                  </h2>
                </div>
                {ongoingProjects && ongoingProjects.length > 0 ? (
                  <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                    {ongoingProjects.map((project) => (
                      <ViewEditCard
                        key={`${project.id}.${project.project_title}`}
                        name={project.project_title}
                        address={project.location}
                        endDate={String(project.end_date)}
                        edit={isEdit}
                        canDelete={true}
                        image={project.image_url}
                        role="client"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No ongoing projects at this time.
                  </p>
                )}

                <Separator className="my-6" />

                {/* Finished Projects */}
                <div className="flex items-center mb-4">
                  <CheckCircle2
                    className={`h-5 w-5 mr-2 ${
                      isEdit ? "text-primary" : "text-slate-900"
                    }`}
                  />
                  <h2
                    className={`font-semibold text-lg ${
                      isEdit ? "text-primary" : "text-slate-900"
                    }`}
                  >
                    Finished Projects
                  </h2>
                </div>
                {finishedProjects && finishedProjects.length > 0 ? (
                  <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                    {finishedProjects.map((project) => (
                      <ViewEditCard
                        key={`${project.id}.${project.project_title}`}
                        name={project.project_title}
                        address={project.location}
                        endDate={String(project.end_date)}
                        edit={isEdit}
                        canDelete={true}
                        image={project.image_url}
                        role="client"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">
                    No finished projects at this time.
                  </p>
                )}

                {isEdit && (
                  <div className="flex justify-end items-end gap-2 pt-4">
                    <Button
                      type="button"
                      onClick={closeEdit}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </Button>
                    <BtnDialog
                      dialogDescription="Do you confirm to update this account's details?"
                      dialogTitle="Edit Account Details"
                      variant="default"
                      submitType="submit"
                      submitTitle="Submit"
                      btnTitle="Save Details"
                      onClick={handleSubmit(processForm)}
                      className="text-white"
                      alt={"edit project save button"}
                    />
                  </div>
                )}
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
