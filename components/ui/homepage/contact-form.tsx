"use client";

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { ContactFormSchemaType } from "@/lib/form-constants/form-constants";
import FormInput from "../general/form-components/form-input";
import { Button } from "../button";
import { emailPattern } from "@/lib/utils";
import { useSendContactForm } from "@/hooks/external-api/use-contact-form";
import { toast } from "@/hooks/use-toast";
import { Fragment } from "react";
import { LoadingCircle } from "../general/loading-circle";

export default function ContactForm() {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ContactFormSchemaType>({
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  //api call for sending contact form
  const { mutate, isLoading } = useSendContactForm();

  //function to be triggered if form submission is a sucess
  const onSuccess = (response: any) => {
    toast({
      variant: "default",
      title: "Contact Form",
      description: response.message || "Form successfully submitted",
    });
    reset(); //reset form fields
  };

  //function to be triggered if form submission failed
  const onError = (error: any) => {
    toast({
      variant: "destructive",
      title: "Contact Form",
      description: error.message || "There was an error submitting the form",
    });
  };

  const processSubmit: SubmitHandler<ContactFormSchemaType> = async (data) => {
    //send the form
    mutate(
      data, // Actual request body
      {
        onSuccess: (response) => {
          onSuccess(response);
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
  };

  return (
    <section
      id="contact-form"
      className="w-full h-fit xl:h-screen homepage-padding flex-col-start bg-white-secondary space-y-10  "
      style={{
        backgroundImage:
          'linear-gradient(to right,rgba(246, 246, 246, 1), rgba(246, 246, 246, 1), rgba(255, 255, 255, 0)), url("/homepage/bg-contact-form.webp")',
        backgroundSize: "cover",
      }}
    >
      <div className="w-full xl:h-[20%] flex-col-start-end">
        <h1 className="text-2xl lg:text-5xl 2xl:text-7xl font-bold ">
          Contact Form
        </h1>
        <p className="text-sm md:text-xl lg:text-3xl">
          Send a message to schedule a consulation or get a quotation
        </p>
      </div>
      <form
        onSubmit={handleSubmit(processSubmit)}
        className="h-fit xl:h-[80%] xl:w-1/2 xl:aspect-square flex-col-between-start flex-grow card-appearance overflow-y-auto gap-4 xl:gap-0"
      >
        <div className="w-full space-y-4">
          <FormInput
            name={"name"}
            register={register}
            errorMessage={errors.name?.message}
            validationRules={{ required: "Name is Required" }}
            label={"Name"}
            inputType={"default"}
            placeholder="Ex. John Doe"
          />
          <FormInput
            name={"email"}
            register={register}
            errorMessage={errors.email?.message}
            validationRules={{
              required: "Email is Required",
              pattern: {
                value: emailPattern,
                message: "Invalid email format",
              },
            }}
            label={"Email"}
            inputType={"default"}
            placeholder="Ex. johndoe@example.com"
          />
          <FormInput
            name={"message"}
            register={register}
            className="h-[200px]"
            errorMessage={errors.message?.message}
            validationRules={{ required: "Message is Required" }}
            label={"Message"}
            inputType={"textArea"}
            placeholder="Write something here..."
          />
        </div>
        <div className="w-full flex-row-end-start">
          <Button className="font-semibold" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                Submitting{" "}
                <LoadingCircle color="border-white-secondary" size={15} />
              </>
            ) : (
              <Fragment>
                Submit
                <Image
                  width={20}
                  height={20}
                  src={"/homepage/contact-form-submit.svg"}
                  alt={"contact-form-submit"}
                />
              </Fragment>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
