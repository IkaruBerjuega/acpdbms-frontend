"use client";

import {
  AccountActions as AccountTableActions,
  AccountsTableType,
} from "@/lib/definitions";
import { ButtonIconTooltipDialog, ButtonTooltip } from "../../button";
import { useAccountActions } from "@/hooks/api-calls/admin/use-account";
import { toast } from "@/hooks/use-toast";
import { AccountActionsRequest } from "@/lib/form-constants/form-constants";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryParams } from "@/hooks/use-query-params";
import { useCheckboxStore } from "@/hooks/states/create-store";

interface AccountActionsProps<T> {
  attrs: T;
}

const AccountActions = <T extends AccountsTableType>({
  attrs,
}: AccountActionsProps<T>): JSX.Element => {
  const { user_id, email, status } = attrs;

  const DialogContent = () => (
    <div className="w-full text-sm">
      <div>Name: {attrs.full_name} </div>
      <div>Email: {attrs.email} </div>
    </div>
  );

  // Get QueryClient from the context
  const queryClient = useQueryClient();
  const { resetData } = useCheckboxStore();

  const onSuccess = (
    response: { message?: string },
    title: string,
    placeholderMessage: string,
    queryKey: string
  ) => {
    toast({
      variant: "default",
      title: title,
      description: response.message || placeholderMessage,
    });
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const onError = (
    error: { message?: string },
    title: string,
    placeholderMessage: string,
    queryKey: string
  ) => {
    toast({
      variant: "destructive",
      title: title,
      description: error.message || placeholderMessage,
    });
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  };

  const { sendReset, deactivateAcc, archiveAcc, activateAcc } =
    useAccountActions<AccountActionsRequest>();

  const actions = {
    sendReset: {
      title: "Send Reset Link",
      action: sendReset,
      message:
        "Are you sure you want to send a password reset link to this account?",
    },
    deactivate: {
      title: "Deactivate Account",
      action: deactivateAcc,
      message:
        "This will deactivate the account. The user will no longer have access. Proceed?",
    },
    archive: {
      title: "Archive Account",
      action: archiveAcc,
      message:
        "Archiving this account will remove it from active records. Are you sure?",
    },
    unarchive: {
      title: "Unarchive Account",
      action: archiveAcc,
      message: "Are you sure you want to unarchive this account?",
    },
    activate: {
      title: "Activate Account",
      action: activateAcc,
      message:
        "Reactivating this account will restore access. Confirm to proceed.",
    },
    undefined: null,
  };

  const { paramsKey } = useQueryParams<{
    role: "client" | "employee";
    archived?: "true" | null;
  }>();

  const { role = "employee", archived } = paramsKey;
  console.log("Query Params:", { role, archived });

  const isArchived = archived === "true";

  const queryKeys = {
    employee: !isArchived ? "employees" : "employees-archived",
    client: !isArchived ? "clients" : "clients-archived",
  };

  const onClick = ({ action }: { action: AccountTableActions }) => {
    if (!action) return;

    const actionFn = actions[action].action;
    const title = actions[action].title;
    const message = actions[action].message;
    const queryKey = queryKeys[role];

    const body =
      action === "sendReset" ? { email: email } : { user_ids: [user_id] };

    actionFn.mutate(body, {
      onSuccess: (response: {
        message?: string;
        skipped_clients?: { message: string };
      }) => {
        if (response.skipped_clients) {
          const error = {
            message:
              "The selected account is not deactivated because it linked to an ongoing project",
          };
          onError(error, title, message, queryKey);

          return;
        }
        onSuccess(response, title, message, queryKey);
      },
      onError: (error: { message?: string }) =>
        onError(error, title, message, queryKey),
    });
    resetData();
  };

  const isStatusActivated = status === "activated";
  const isStatusArchived = status === "archived";
  const isStatusPending = status === "pending";
  const isStatusDeactivated = status === "deactivated";

  return (
    <>
      {isStatusActivated ? (
        <>
          <ButtonTooltip
            tooltip={"View Account"}
            href={`/admin/accounts/${role}/${user_id}/view?edit=false`}
            iconSrc="/button-svgs/table-action-view.svg"
          />
          <ButtonTooltip
            tooltip={"Edit Account"}
            href={`/admin/accounts/${role}/${user_id}/view?edit=true`}
            iconSrc="/button-svgs/table-action-edit.svg"
          />
          <ButtonIconTooltipDialog
            iconSrc={"/button-svgs/table-action-reset-pass.svg"}
            alt={"Send reset link for password button"}
            tooltipContent={"Send Reset Password Link"}
            dialogTitle={"Send Reset Password Link"}
            dialogDescription={"Send a reset password link to the account:"}
            dialogContent={<DialogContent />}
            submitType={"button"}
            submitTitle="Send Link"
            onClick={() => onClick({ action: "sendReset" })}
          />
          <ButtonIconTooltipDialog
            iconSrc={"/button-svgs/table-action-deactivate.svg"}
            alt={"Deactivate account button"}
            tooltipContent={"Deactivate Account"}
            dialogTitle={"Deactivate Account"}
            dialogDescription={"Do you want to deactivate this account?"}
            dialogContent={<DialogContent />}
            submitType={"button"}
            submitTitle="Confirm"
            onClick={() => onClick({ action: "deactivate" })}
          />
        </>
      ) : isStatusDeactivated ? (
        <>
          <ButtonIconTooltipDialog
            iconSrc={"/button-svgs/table-action-activate.svg"}
            alt={"reactivate account button"}
            tooltipContent={"Reactivate Account"}
            dialogTitle={"Reactivate Account"}
            dialogDescription={"Do you confirm to reactivate this account:"}
            dialogContent={<DialogContent />}
            submitType={"button"}
            submitTitle="Confirm"
            onClick={() => onClick({ action: "activate" })}
          />
          <ButtonIconTooltipDialog
            iconSrc={"/button-svgs/table-action-archive.svg"}
            alt={"archive account button"}
            tooltipContent={"Archive Account"}
            dialogTitle={"Archive Account"}
            dialogDescription={"Do you confirm to archive this account?"}
            dialogContent={<DialogContent />}
            submitType={"button"}
            submitTitle="Confirm"
            className="bg-black-secondary hover:!bg-black-primary"
            onClick={() => onClick({ action: "archive" })}
          />
        </>
      ) : isStatusArchived ? (
        <ButtonIconTooltipDialog
          iconSrc={"/button-svgs/table-action-unarchive.svg"}
          alt={"unarhive account button"}
          tooltipContent={"Unarchive Account"}
          dialogTitle={"Unarchive Account"}
          dialogDescription={"Do you confirm to unarchive this account?"}
          dialogContent={<DialogContent />}
          className="bg-green-600 hover:!bg-green-700"
          submitType={"button"}
          submitTitle="Confirm"
          onClick={() => onClick({ action: "unarchive" })}
        />
      ) : isStatusPending ? (
        <>
          <ButtonIconTooltipDialog
            iconSrc={"/button-svgs/table-action-archive.svg"}
            alt={"archive account button"}
            tooltipContent={"Archive Account"}
            dialogTitle={"Archive Account"}
            dialogDescription={"Do you confirm to archive this account?"}
            dialogContent={<DialogContent />}
            submitType={"button"}
            submitTitle="Confirm"
            className="bg-black-secondary hover:!bg-black-primary"
            onClick={() => onClick({ action: "archive" })}
          />
        </>
      ) : null}
    </>
  );
};

export default AccountActions;
