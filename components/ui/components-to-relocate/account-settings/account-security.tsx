import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import FormInput from "../../general/form-components/form-input";
import {
  useAccountSettings,
  getAccountSettings,
} from "@/hooks/general/use-account-settings";
import { BtnDialog, Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { emailPattern } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../card";
import { DialogNoBtn } from "../../dialog";
import {
  PasswordChangeFormProps,
  PasswordChangeRequest,
  UpdateEmailRequest,
} from "@/lib/user-definitions";
import { toast } from "@/hooks/use-toast";

export default function AccountSecurity() {
  const { getUser } = getAccountSettings();
  const { checkEmail, send2FA, update2FA, changePass } = useAccountSettings();

  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [codeSucessfullySent, setCodeSuccessfullySent] = useState<
    "success" | "error" | undefined
  >();
  const [showNewEmailInput, setShowNewEmailInput] = useState<boolean>(false);

  const { data, isLoading, error } = getUser;
  const queryClient = useQueryClient();

  const newEmailMethods = useForm<UpdateEmailRequest>({
    mode: "onChange",
    defaultValues: {
      new_email: "",
      two_factor_code: "",
    },
  });

  const {
    register: emailRegister,
    watch: emailWatch,
    handleSubmit: emailHandleSubmit,
    setError: emailSetError,
    resetField: emailResetField,
    reset: emailReset,
    formState: { errors: emailErrors },
  } = newEmailMethods;

  const passwordChangeFormMethods = useForm<PasswordChangeFormProps>({
    mode: "onChange",
    defaultValues: {
      current_password: "",
      confirm_password: "",
      new_password: "",
    },
  });

  const {
    register: passwordRegister,
    watch: passwordWatch,
    handleSubmit: passHandleSubmit,
    setError: passSetError,
    resetField: passResetField,
    reset: passReset,
    formState: { errors: passErrors },
  } = passwordChangeFormMethods;

  const watchedEmail = emailWatch("new_email");
  const watchedNewPassword = passwordWatch("new_password");
  const watchedConfirmPassword = passwordWatch("confirm_password");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedEmail && emailPattern.test(watchedEmail)) {
        checkEmail.mutate(
          { new_email: watchedEmail },
          {
            onSuccess: () => {
              setIsEmailValid(true);
            },
            onError: (err) => {
              setIsEmailValid(false);
              emailSetError("new_email", {
                type: "manual",
                message: err.message || "Email is already taken",
              });
            },
          }
        );
      } else {
        setIsEmailValid(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedEmail]);

  const handleSend2FA = (email: string) => {
    // Call the send2FA API mutation to send the code
    send2FA.mutate(
      { email: email },
      {
        onSuccess: () => setCodeSuccessfullySent("success"),
        onError: () => setCodeSuccessfullySent("error"),
      }
    );
  };

  const handleUpdateEmail: SubmitHandler<UpdateEmailRequest> = (data) => {
    update2FA.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: "Change Email",
          description: data.message || "Email successfully changed!",
        });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setEditMode(false);
        emailReset;
      },
      onError: (err) => {
        emailSetError("two_factor_code", {
          type: "manual",
          message: err.message || "Invalid 2FA code",
        });
      },
    });
  };

  const handleUpdatePassword: SubmitHandler<PasswordChangeFormProps> = (
    data
  ) => {
    const requestBody: PasswordChangeRequest = {
      current_password: data.current_password,
      new_password: data.new_password,
    };

    changePass.mutate(requestBody, {
      onSuccess: (data: { message: string }) => {
        toast({
          title: "Change Password",
          description: data.message || "Password successfully changed!",
        });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setPasswordEditMode(false);
        passReset();
      },
      onError: (err: any) => {
        const errorData = err?.message as {
          current_password?: string[];
          new_password?: string[];
        };

        if (errorData?.current_password?.[0]) {
          passSetError("current_password", {
            type: "manual",
            message: errorData.current_password[0],
          });
        }

        if (errorData?.new_password?.[0]) {
          passSetError("new_password", {
            type: "manual",
            message: errorData.new_password[0],
          });
        }
      },
    });
  };

  const dialogConfig = {
    success: "2FA code sent successfully to your email.",
    error: "There was an error processing the request",
  };

  const passwordsDoesMatch =
    watchedNewPassword &&
    watchedConfirmPassword &&
    watchedNewPassword === watchedConfirmPassword &&
    !passErrors.new_password &&
    !passErrors.confirm_password;

  const passwordDoesNotMatch =
    watchedNewPassword &&
    watchedConfirmPassword &&
    watchedNewPassword !== watchedConfirmPassword;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Email</CardTitle>
            {!editMode && (
              <Button className="flex" onClick={() => setEditMode(true)}>
                Change Email
              </Button>
            )}
          </div>
          <CardDescription>Current Email: {data?.email}</CardDescription>
        </CardHeader>

        {editMode && (
          <CardContent className="space-y-4">
            <form
              onSubmit={emailHandleSubmit(handleUpdateEmail)}
              className="space-y-4"
            >
              <FormInput
                name="new_email"
                dataType="email"
                inputType="default"
                label="New Email"
                placeholder="Enter new email"
                register={emailRegister}
                required
                errorMessage={emailErrors.new_email?.message}
              />

              {!watchedEmail && (
                <p className="text-sm text-muted-foreground ml-1">
                  Please enter your new email.
                </p>
              )}

              {watchedEmail && !emailErrors.new_email && isEmailValid && (
                <p className="text-sm text-green-600 ml-1">
                  Email is available!
                </p>
              )}

              <Button
                type="button"
                disabled={
                  !watchedEmail || !!emailErrors.new_email || !isEmailValid
                }
                onClick={() => handleSend2FA(watchedEmail)}
              >
                Send 2FA to Email
              </Button>

              {showNewEmailInput && (
                <FormInput
                  name="two_factor_code"
                  label="2FA Code"
                  inputType="default"
                  placeholder="Enter 2FA code"
                  register={emailRegister}
                  required
                  errorMessage={emailErrors.two_factor_code?.message}
                />
              )}

              {showNewEmailInput && (
                <BtnDialog
                  btnTitle={"Submit"}
                  isLoading={update2FA.isLoading}
                  alt={"Submit Button"}
                  dialogTitle={"Change Email"}
                  dialogDescription={"Do you confirm on changing your email? "}
                  onClick={emailHandleSubmit(handleUpdateEmail)}
                  submitType={"button"}
                  submitTitle="Confirm"
                  variant={"default"}
                />
              )}
            </form>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Password</CardTitle>
            {!passwordEditMode && (
              <Button onClick={() => setPasswordEditMode(true)}>
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>

        {passwordEditMode && (
          <CardContent className="space-y-4">
            <form
              onSubmit={passHandleSubmit(handleUpdatePassword)}
              className="space-y-4"
            >
              <FormInput
                name="current_password"
                dataType="password"
                inputType="default"
                label="Current Password"
                placeholder="Enter current password"
                register={passwordRegister}
                required
                errorMessage={passErrors.current_password?.message}
              />

              <FormInput
                name="new_password"
                dataType="password"
                inputType="default"
                label="New Password"
                placeholder="Enter new password"
                register={passwordRegister}
                required
                errorMessage={passErrors.new_password?.message}
              />

              <FormInput
                name="confirm_password"
                dataType="password"
                inputType="default"
                label="Confirm New Password"
                placeholder="Re-enter new password"
                register={passwordRegister}
                required
                errorMessage={passErrors.confirm_password?.message}
              />

              {passwordsDoesMatch ? (
                <p className="text-sm text-green-600 ml-1">Passwords match!</p>
              ) : passwordDoesNotMatch ? (
                <p className="text-sm text-red-600 ml-1">
                  Passwords don't match!
                </p>
              ) : null}

              <BtnDialog
                btnTitle={"Submit"}
                isLoading={changePass.isLoading}
                alt={"Submit Button"}
                dialogTitle={"Change Password"}
                dialogDescription={"Do you confirm on changing your password? "}
                onClick={passHandleSubmit(handleUpdatePassword)}
                submitType={"button"}
                submitTitle="Confirm"
                variant={"default"}
              />
            </form>
          </CardContent>
        )}
      </Card>

      {codeSucessfullySent && codeSucessfullySent !== undefined && (
        <DialogNoBtn
          title={"Update Email"}
          description={dialogConfig[codeSucessfullySent!]}
          onClick={() => {
            setCodeSuccessfullySent(undefined);
            setShowNewEmailInput(true);
          }}
          onOpen={!!codeSucessfullySent}
          onClose={() => {
            setCodeSuccessfullySent(undefined);
            setShowNewEmailInput(true);
          }}
        />
      )}
    </div>
  );
}
