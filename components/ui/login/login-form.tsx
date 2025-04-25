"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import FormInput from "@/components/ui/general/form-components/form-input";
import {
  loginRequest,
  LoginSchemaType,
} from "@/lib/form-constants/form-constants";
import { Button } from "../button";
import { useDeviceToken, useRole, useToken } from "@/hooks/general/use-token";
import { useLogin } from "@/hooks/general/use-login";
import { LoadingCircle } from "../general/loading-circle";
import { useRouter } from "next/navigation";
import { emailPattern } from "@/lib/utils";
import {
  LoginResponseInterface,
  Verify2FARequest,
  Verify2FAResponse,
} from "@/lib/definitions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiMailCheckFill, RiMailCloseFill } from "react-icons/ri";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Checkbox } from "../checkbox";
import { useDeviceTokenStore } from "@/hooks/states/create-store";

const default2faTimer = 180; //default2faTimer seconds

export default function LoginForm() {
  const loginMethods = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verify2faMethods = useForm<Verify2FARequest>({
    defaultValues: {
      email: "",
      code: "",
      trust_device: false,
    },
  });

  //use Router
  const router = useRouter();

  const {
    handleSubmit: loginSubmit,
    register: loginRegister,
    watch: loginWatch,
  } = loginMethods;
  const {
    handleSubmit: verify2faSubmit,
    setValue: verify2faSetValue,
    control: verifyControl,
  } = verify2faMethods;

  const { login, verify2fa, resend2fa } = useLogin();

  const [shouldVerify, setShouldVerify] = useState<boolean>(false);

  //destructure to get store token function from useToken. This stores http only cookie
  //it will store the logged in user's information and the token
  const { storeToken } = useToken();
  const { storeRole } = useRole();
  const { storeDeviceToken, getDeviceToken } = useDeviceToken();
  const { setData } = useDeviceTokenStore();

  //this function will be triggered when the login is successful, will set cookies here
  const onRedirect = async (role: "admin" | "employee" | "client") => {
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "employee") {
      router.push("/employee/tasks?view=assigned");
    } else {
      router.push("/client/approval?view=to review");
    }
  };

  //use effect to re render verification timer
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

  const storeCookies = async ({
    token,
    role,
    device_token,
    email,
  }: {
    token: string;
    role: "admin" | "employee" | "client";
    device_token?: string;
    email: string;
  }) => {
    const isTokenStored = await storeToken({ token: token });
    const isRoleStored = await storeRole({ role: role });

    let isDeviceTokenStored;

    if (device_token) {
      isDeviceTokenStored = await storeDeviceToken({
        device_token: device_token,
        email: email,
      });
    }

    const canRedirect =
      isTokenStored && isRoleStored && device_token
        ? !!isDeviceTokenStored
        : true;

    if (canRedirect) {
      setData([device_token]);
      await onRedirect(role);
    }
  };

  const loginProcessForm: SubmitHandler<LoginSchemaType> = async (data) => {
    // const response = await login(data);

    const device_token = await getDeviceToken({ email: data.email });

    const body: loginRequest = {
      email: data.email,
      password: data.password,
      ...(device_token ? { device_token: device_token.device_token } : {}),
    };

    login.mutate(body, {
      onSuccess: async (responseData: LoginResponseInterface) => {
        if (
          responseData.message === "2FA code sent to your email" ||
          responseData.remaining_seconds
        ) {
          verify2faSetValue("email", data.email);
          setShouldVerify(true);
          setTimeLeft(responseData.remaining_seconds || default2faTimer);
        } else {
          storeCookies({
            token: responseData.token,
            role: responseData.user.role,
            device_token: device_token?.device_token,
            email: data.email,
          });
        }
      },
    });
  };

  //resend 2fa
  const handleResend2fa = () => {
    resend2fa.mutate(
      { email: loginWatch("email") },
      {
        onSuccess: () => {
          setCanResend(false);
          setTimeLeft(default2faTimer);
        },
      }
    );
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

  // Process verification
  const handleProcessVerification: SubmitHandler<Verify2FARequest> = (data) => {
    verify2fa.mutate(data, {
      onSuccess: async (response: Verify2FAResponse) => {
        storeCookies({
          token: response.token,
          role: response.user.role,
          ...(data.trust_device ? { device_token: response.device_token } : {}),
          email: data.email,
        });
      },
    });
  };

  return (
    <>
      {!shouldVerify ? (
        <form onSubmit={loginSubmit(loginProcessForm)}>
          <div className="text-red-500 justify-center text-center text-sm mt-2">
            {login.error && <p>{login.error}</p>}
          </div>

          <div className="mt-4">
            <FormInput
              name={"email"}
              dataType="email"
              inputType="default"
              validationRules={emailValidation}
              label={""}
              placeholder={"Enter Email"}
              register={loginRegister}
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
              register={loginRegister}
              required={false}
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link className="text-xs" href={"/forgot-password"}>
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white-secondary mt-10"
            disabled={login.isLoading}
          >
            {login.isLoading ? (
              <>
                Logging in <LoadingCircle size={15} />
              </>
            ) : (
              "LOG IN"
            )}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={verify2faSubmit(handleProcessVerification)}
          className="mt-5"
        >
          <div className="w-full flex-col-center  ">
            {canResend ? (
              <RiMailCloseFill className="text-7xl " />
            ) : (
              <RiMailCheckFill className="text-7xl " />
            )}
            <div className="text-center text-sm">
              {canResend ? (
                <span className="text-red-500">
                  Verification code has expired. Click resend.
                </span>
              ) : (
                ` A verification code has been sent to ${loginWatch(
                  "email"
                )}. Enter the verification code.`
              )}
            </div>
          </div>
          <div className="text-red-500 justify-center text-center  text-sm mt-2">
            {verify2fa.error && <p>{verify2fa.error}</p>}
          </div>

          <div className="w-full flex-col-center gap-4 ">
            <Controller
              control={verifyControl}
              name="code"
              rules={{
                required: "Code is required",
                minLength: { value: 6, message: "Code must be 6 digits" },
                maxLength: { value: 6, message: "Code must be 6 digits" },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { error },
              }) => (
                <div className="space-y-4 w-full">
                  <div className="w-full flex-col-center space-y-2">
                    <InputOTP
                      maxLength={6}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                    >
                      <InputOTPGroup className="space-x-2 w-full ">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>{" "}
                    {error && (
                      <p className="text-red-500 text-xs ">{error.message}</p>
                    )}
                  </div>

                  <div className="w-full flex  justify-evenly items-center">
                    <div className="flex-row-start-center gap-1">
                      <Checkbox
                        onCheckedChange={(value) =>
                          verify2faSetValue("trust_device", !!value)
                        }
                      />
                      <span className="text-xs">
                        Remember this device for 30 days
                      </span>
                    </div>
                    <button
                      className={`text-xs ${
                        !canResend
                          ? "text-gray-400"
                          : "text-blue-500 font-semibold"
                      } `}
                      disabled={!canResend}
                      onClick={handleResend2fa}
                    >
                      {resend2fa.isLoading ? (
                        "loading..."
                      ) : (
                        <>
                          Resend
                          {!canResend ? ` in ${timeLeft.toFixed(0)}s` : " code"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white-secondary mt-10"
            disabled={verify2fa.isLoading}
          >
            {verify2fa.isLoading ? (
              <>
                Logging in <LoadingCircle size={15} />
              </>
            ) : (
              "SUBMIT"
            )}
          </Button>

          <button
            onClick={() => setShouldVerify(false)}
            className="text-xs text-slate-500 mt-5  w-full flex-col-center"
          >
            Back To Login
          </button>
        </form>
      )}
    </>
  );
}
