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
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query"; // Import queryClient

import FormInput from "@/components/ui/general/form-components/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/general/use-profile";
import { ViewEditCard } from "./project-view-card";
import { adminUpdateProfile } from "@/lib/form-constants/form-constants";
import USLocationSelector from "@/components/ui/general/location-selector";

export default function EmpAccView({
  id,
  isEdit,
}: {
  id: string;
  isEdit: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient(); // get the query client instance

  // Functions to set or remove the "edit" query parameter.
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

  // Populate form data when profileDetails change.
  useEffect(() => {
    if (profileDetails?.employee) {
      reset({
        first_name: profileDetails.employee.first_name,
        middle_name: profileDetails.employee.middle_name || "",
        last_name: profileDetails.employee.last_name,
        phone_number: profileDetails.employee.phone_number || "",
        street: profileDetails.employee.street || "",
        city_town: profileDetails.employee.city_town || "",
        state: profileDetails.employee.state || "",
        zip_code: profileDetails.employee.zip_code || "",
        email: profileDetails.email || "",
        position: profileDetails.employee.position || "",
      });
    }
  }, [profileDetails, reset]);

  const processForm: SubmitHandler<adminUpdateProfile> = async (data) => {
    const formattedData = {
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      street: data.street,
      city_town: data.city_town,
      state: data.state,
      zip_code: data.zip_code,
      position: data.position,
    };

    updateProfileFromAdminMutation.mutate(formattedData, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: "Notification",
          description:
            response.message || "You successfully updated the account details",
        });
        queryClient.invalidateQueries({ queryKey: ["user-details", id] });
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
      profileDetails?.employee?.street,
      profileDetails?.employee?.city_town,
      profileDetails?.employee?.state,
      profileDetails?.employee?.zip_code,
    ]
      .filter(Boolean)
      .join(", ") || "Not Set";

  const phoneNumber = profileDetails?.employee?.phone_number || "Not Set";
  const email = profileDetails?.email || "Not Set";
  const position = profileDetails?.employee?.position || "Not Set";
  const noProfile = "/no-profile.png";

  const [imgSrc, setImgSrc] = useState<string>(
    profileDetails?.profile_picture_url || noProfile
  );
  useEffect(() => {
    setImgSrc(profileDetails?.profile_picture_url || noProfile);
  }, [profileDetails]);

  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto min-h-0 flex-1">
      <div className="max-w-5xl mx-auto">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(processForm)} className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={imgSrc}
                        alt={`${
                          profileDetails?.employee?.first_name || "First"
                        } ${
                          profileDetails?.employee?.last_name || "Last"
                        }'s Image`}
                        quality={100}
                        className="object-cover"
                        fill
                        onError={() => setImgSrc(noProfile)}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="text-2xl font-bold text-primary mb-1">
                        {`${profileDetails?.employee?.first_name || "First"} ${
                          profileDetails?.employee?.last_name || "Last"
                        }`}
                      </h1>
                      <div className="text-slate-600 text-sm space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-primary mr-2" />
                          <p>Phone Number: {phoneNumber}</p>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-primary mr-2" />
                          <p>Address: {address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Ensure the button is explicitly type="button" */}
                  {!isEdit && (
                    <Button
                      type="button"
                      className="self-start"
                      onClick={handleEdit}
                      size="sm"
                    >
                      <Edit className="text-base mr-2" /> Edit Details
                    </Button>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Personal Details Header */}
                <div className="flex items-center mb-4">
                  <User
                    className={`h-5 w-5 mr-2 ${
                      isEdit ? "text-primary" : "text-slate-900"
                    }`}
                  />
                  <h2
                    className={`font-semibold text-lg ${
                      isEdit ? "text-primary" : "text-slate-900"
                    }`}
                  >
                    Personal Details
                  </h2>
                </div>

                {/* Personal Details */}
                {isEdit ? (
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
                        setValue={setValue}
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

                    {/* Other Details */}
                    <div className="lg:col-span-4 col-span-1">
                      <Separator className="my-4" />
                      <div className="flex items-center mb-4">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <h2 className="font-semibold text-lg text-primary">
                          Other Details
                        </h2>
                      </div>
                    </div>
                    {/* Email (view-only) */}
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-base text-slate-700">{email}</p>
                    </div>
                    <FormInput
                      name="position"
                      label="Position"
                      inputType="default"
                      register={register}
                      errorMessage={errors.position?.message}
                    />
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">First Name</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.employee?.first_name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Middle Name</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.employee?.middle_name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Last Name</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.employee?.last_name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <p className="text-base text-slate-700">{phoneNumber}</p>
                    </div>

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
                        {profileDetails?.employee?.state || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">City/Town</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.employee?.city_town || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Zip Code</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.employee?.zip_code || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Street</p>
                      <p className="text-base text-slate-700">
                        {profileDetails?.employee?.street || "Not Set"}
                      </p>
                    </div>

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
                    <div>
                      <p className="text-sm text-slate-500">Position</p>
                      <p className="text-base text-slate-700">{position}</p>
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
                    {ongoingProjects.map((p) => (
                      <ViewEditCard
                        key={`${p.id}.${p.project_title}`}
                        name={p.project_title}
                        address={p.location}
                        endDate={String(p.end_date)}
                        id={id}
                        edit={isEdit}
                        canDelete
                        image={p.image_url}
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
                    {finishedProjects.map((p) => (
                      <ViewEditCard
                        key={`${p.id}.${p.project_title}`}
                        name={p.project_title}
                        address={p.location}
                        endDate={String(p.end_date)}
                        id={id}
                        edit={isEdit}
                        canDelete
                        image={p.image_url}
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
                      onClick={() => handleSubmit(processForm)()}
                      className="text-white"
                      alt="edit account save"
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
