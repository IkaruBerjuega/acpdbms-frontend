"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { BtnDialog } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  useAccountSettings,
  getAccountSettings,
} from "@/hooks/general/use-account-settings";
import { toast } from "@/hooks/use-toast";
import ProfilePictureSettings from "./update-picture";
import FormInput from "../../general/form-components/form-input";
import {
  UpdateUserInfoRequest,
  UserInfoInterface,
} from "@/lib/user-definitions";

export default function ProfileSettings({
  role,
}: {
  role: "employee" | "client";
}) {
  const methods = useForm<UserInfoInterface>({
    mode: "onBlur",
  });

  const { getUser } = getAccountSettings();
  const { updateProfile } = useAccountSettings();
  const queryClient = useQueryClient();

  const { handleSubmit, register, reset } = methods;

  const { data: userData, error: userError, isLoading: userLoading } = getUser;
  console.log(userData);

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const processForm: SubmitHandler<UserInfoInterface> = (data) => {
    const requestBody: UpdateUserInfoRequest = {
      first_name: data[role].first_name,
      middle_name: data[role].middle_name,
      last_name: data[role].last_name,
      phone_number: data[role].phone_number,
      street: data[role].street,
      city_town: data[role].city_town,
      state: data[role].state,
      zip_code: data[role].zip_code,
    };

    updateProfile.mutate(requestBody, {
      onSuccess: (response: { message: string }) => {
        toast({
          variant: "default",
          title: "Profile Updated",
          description: response.message || "Profile updated successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: response.message || "Failed to update profile.",
        });
      },
    });
  };

  const profile = userData?.profile_picture_url;
  const fname = userData?.employee?.first_name || userData?.client.first_name;

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Error loading user data: {userError.message}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Profile Picture Section */}
      <div className="w-full lg:w-[30rem]">
        <Card className="sticky top-12 pb-4">
          <CardHeader>
            <CardTitle className="text-lg">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProfilePictureSettings profile={profile} fname={fname} />
          </CardContent>
        </Card>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(processForm)}
        className="flex-1 overflow-y-auto pr-0 lg:pr-2"
        style={{
          maxHeight: "calc(76vh - 6rem)",
        }}
      >
        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormInput
                name={`${role}.first_name`}
                label="First Name"
                inputType="default"
                register={register}
                required
              />
              <FormInput
                name={`${role}.middle_name`}
                label="Middle Name"
                inputType="default"
                register={register}
                required={false}
              />
              <FormInput
                name={`${role}.last_name`}
                label="Last Name"
                inputType="default"
                register={register}
                required
              />
              {role === "employee" && (
                <FormInput
                  fieldBg="bg-primary/10"
                  name={`${role}.position`}
                  label="Position"
                  inputType="default"
                  register={register}
                  required={false}
                  readOnly
                />
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormInput
                name={`${role}.phone_number`}
                label="Phone Number"
                inputType="default"
                register={register}
                required
              />
              <FormInput
                fieldBg="bg-primary/10"
                name="email"
                label="Email"
                inputType="default"
                register={register}
                required={false}
                readOnly
              />
            </CardContent>
          </Card>

          {/* Address Info */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormInput
                name={`${role}.street`}
                label="Street"
                inputType="default"
                register={register}
                required
              />
              <FormInput
                name={`${role}.city_town`}
                label="City/Town"
                inputType="default"
                register={register}
                required
              />
              <FormInput
                name={`${role}.state`}
                label="State"
                inputType="default"
                register={register}
                required
              />
              <FormInput
                name={`${role}.zip_code`}
                label="Zip Code"
                inputType="default"
                register={register}
                required
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <BtnDialog
              btnTitle={"Submit"}
              isLoading={userLoading}
              alt={"Submit Button"}
              dialogTitle={"Profile"}
              dialogDescription={
                "Do you confirm on submitting your profile changes? "
              }
              onClick={handleSubmit(processForm)}
              submitType={"button"}
              submitTitle="Confirm"
              variant={"default"}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
