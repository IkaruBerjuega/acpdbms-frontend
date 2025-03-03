"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/ui/general/form-components/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginSchemaType } from "@/lib/form-constants/form-constants";
import { Button } from "../button";
import { useToken } from "@/hooks/api-calls/use-token";
import { useLogin } from "@/hooks/api-calls/use-login";
import { LoadingCircle } from "../general/loading-circle";
import { useRouter } from "next/navigation";
import { emailPattern } from "@/lib/utils";
import { LoginResponseInterface } from "@/lib/definitions";

export default function LoginForm() {
  const methods = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //use Router
  const router = useRouter();

  const { handleSubmit, register } = methods;

  const { mutate, isLoading, error } = useLogin();

  //destructure to get store token function from useToken. This stores http only cookie
  //it will store the logged in user's information and the token
  const { storeTokenWithUserData } = useToken();

  //this function will be triggered when the login is successful, will set cookies here
  const onRedirect = async (responseData: LoginResponseInterface) => {
    const isStored = await storeTokenWithUserData(responseData);

    if (isStored) {
      const role = responseData.user.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "employee") {
        router.push("/employee/tasks");
      } else {
        router.push("/client/tasks");
      }
    }
  };

  const processForm: SubmitHandler<LoginSchemaType> = (data) => {
    // const response = await login(data);
    mutate(data, {
      onSuccess: async (responseData) => {
        await onRedirect(responseData);
      },
      onError: (error) => console.log(error),
    });
  };

  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: emailPattern,
      message: "Invalid email format",
    },
  };

  const passwordValidation = {
    required: "Password is required",
  };

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <div className="text-red-500 justify-center text-center h-6 text-sm mt-2">
        {error && <p>{error}</p>}
      </div>

      <div className="mt-8">
        <FormInput
          name={"email"}
          dataType="email"
          inputType="default"
          validationRules={emailValidation}
          label={""}
          placeholder={"Enter Email"}
          register={register}
          required={false}
        />
      </div>
      <div className="mt-4">
        <FormInput
          name={"password"}
          dataType="password"
          inputType="default"
          validationRules={passwordValidation}
          label={""}
          placeholder={"Enter Password"}
          register={register}
          required={false}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <Checkbox
            id="remember-me"
            className="border-black rounded data-[state=checked]:bg-eerieblack"
          />
          <label
            htmlFor="remember-me"
            className="text-xs ml-2 text-gray-800 hover:underline leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember Me
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white-secondary mt-10"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            Logging in <LoadingCircle size={15} />
          </>
        ) : (
          "LOG IN"
        )}
      </Button>
    </form>
  );
}
