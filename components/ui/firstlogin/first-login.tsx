"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/general/use-profile";
import { toast } from "@/hooks/use-toast";
import { StepIndicator } from "./step-indicator";
import AccDetails from "./forms/account-details";
import { Address } from "./forms/address";
import { Photo } from "./forms/upload-profile";
import { NavigationButtons } from "./navigation-buttons";
import { firstLogin } from "@/lib/form-constants/form-constants";

export default function FirstLogin() {
  const router = useRouter();
  const { getAuthenticatedUser, updateProfileMutation } = useProfile("");
  const [userType, setUserType] = useState("");

  const methods = useForm<firstLogin>({
    mode: "onChange",
    defaultValues: {
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      phone_number: "",
      state: "",
      city_town: "",
      street: "",
      zip_code: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid },
  } = methods;

  // fetch authenticated user details and update the form's default values
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getAuthenticatedUser();
        const user = response?.user || response;

        let firstName = "";
        let middleName = "";
        let lastName = "";

        if (user.employee) {
          firstName = user.employee.first_name || "";
          middleName = user.employee.middle_name || "";
          lastName = user.employee.last_name || "";
          setUserType("employee");
        } else if (user.client) {
          firstName = user.client.first_name || "";
          middleName = user.client.middle_name || "";
          lastName = user.client.last_name || "";
          setUserType("client");
        } else {
          firstName = user.first_name || "";
          middleName = user.middle_name || "";
          lastName = user.last_name || "";
          setUserType("");
        }

        methods.reset({
          email: user.email || "",
          first_name: firstName,
          middle_name: middleName && middleName !== "null" ? middleName : "",
          last_name: lastName,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []); // run once on mount

  const [step, setStep] = useState(0);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const isDisabled = step !== 0 && !isValid;

  const processForm: SubmitHandler<firstLogin> = async (data) => {
    if (data.phone_number !== undefined) {
      data.phone_number = data.phone_number.toString();
    }
    if (data.zip_code !== undefined) {
      data.zip_code = data.zip_code.toString();
    }

    updateProfileMutation.mutate(data, {
      onSuccess: (response: { message: string }) => {
        toast({
          title: "Notification",
          description:
            response.message || "Profile Information Successfully Updated",
        });
        if (userType === "employee") {
        } else {
          router.push("/client/approval");
        }
      },
      onError: (response: { message: string }) => {
        toast({
          variant: "destructive",
          title: "Notification",
          description: response.message || "Can't Update Profile Information",
        });
      },
    });
  };

  const confirmSubmit = () => {
    handleSubmit(processForm)();
  };

  const handleNextStep = async () => {
    if (step === 0) {
      nextStep();
    } else if (step === 1 || step === 2) {
      const isStepValid = await trigger();
      if (isStepValid) {
        nextStep();
      }
    } else if (step === 3) {
      nextStep();
    } else if (step === 4) {
      confirmSubmit();
    }
  };
  return (
    <FormProvider {...methods}>
      <div className="bg-white-secondary bg-center h-screen w-full">
        <div className="w-full grid grid-cols-1 mx-auto p-8 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-2 text-3xl lg:text-4xl lg:mt-24 lg:ml-12">
            <StepIndicator currentStep={step} />
            {step === 0 ? (
              <p className="text-primary font-semibold">
                Welcome to Larry&apos;s Home Designs. Click proceed when
                you&apos;re ready.
              </p>
            ) : step === 1 ? (
              <p className="text-primary font-semibold">
                Check your account details and enter your contact information.
              </p>
            ) : step === 2 ? (
              <p className="text-primary font-semibold">
                Fill out your contact information / address.
              </p>
            ) : step === 3 ? (
              <p className="text-primary font-semibold">
                Upload your profile picture.
              </p>
            ) : (
              <p className="text-primary font-semibold">
                Please review your information carefully before proceeding.
                Click &apos;Save&apos; to confirm.
              </p>
            )}
          </div>

          <div className="flex flex-col w-full mx-auto gap-4 mt-8 lg:mt-16 lg:justify-center lg:items-center">
            {step === 0 ? (
              <div className="flex flex-col gap-4 h-[300px]"></div>
            ) : step === 1 ? (
              <AccDetails />
            ) : step === 2 ? (
              <Address />
            ) : step === 3 ? (
              <Photo />
            ) : (
              <div className="flex flex-col gap-4 h-[468px]"></div>
            )}
            <NavigationButtons
              step={step}
              handleNextStep={handleNextStep}
              prevStep={prevStep}
              isDisabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
