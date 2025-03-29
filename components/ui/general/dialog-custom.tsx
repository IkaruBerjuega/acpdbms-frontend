import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { MouseEventHandler, useState } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "../alert-dialog";

interface DialogProps {
  label: string;
  dialogTitle: string;
  dialogDescription: string | JSX.Element;
  dialogCancel: string;
  dialogAction: string;
  className: string;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export function Dialog({
  label,
  dialogTitle,
  dialogDescription,
  dialogCancel,
  dialogAction,
  className,
  onClick,
}: DialogProps) {
  // State to control if the dialog is open
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Function to handle the button click and close the dialog after the action is processed
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) {
      onClick(event); // Process the provided onClick action
    }
    setDialogOpen(false); // Close the dialog after processing
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`bg-gray-800 hover:bg-gray-900 text-white-primary ${className}`}
          onClick={() => setDialogOpen(true)}
        >
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white-primary rounded-md shadow-lg w-full max-w-md p-6">
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="text-primary text-lg font-semibold">
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-700">
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            {dialogCancel && (
              <AlertDialogCancel className="px-4 py-2 text-primary border border-primary bg-white-primary hover:bg-gray-200 rounded mt-5">
                {dialogCancel}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              type="submit"
              onClick={handleClick}
              className="px-4 py-2 text-white-primary bg-gray-800 hover:bg-primary rounded mt-5"
            >
              {dialogAction}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
