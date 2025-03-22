import { useForm, Controller, useFormContext } from "react-hook-form";
import { IoWarningOutline } from "react-icons/io5";
import { useAccounts } from "@/hooks/api-calls/admin/use-account";
import FormInput from "../../general/form-components/form-input";
import { ProjectFormSchemaType } from "@/lib/form-constants/project-constants";
import { ClientInterface } from "@/lib/definitions";
import { requireError } from "@/lib/utils";

type StepInputs = ProjectFormSchemaType;

interface ClientItem {
  value: string;
  label: string;
}

export default function ProjectDetails() {
  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useFormContext<StepInputs>();

  const {
    data: clientAccounts,
    isPending,
    error,
  } = useAccounts<ClientInterface>({
    role: "client",
    isArchived: false,
  });

  const clientItems: ClientItem[] =
    clientAccounts?.map((client) => ({
      value: String(client.id), // Convert number to string
      label: client.full_name,
    })) || [];

  return (
    <main className="flex flex-col gap-8 mb-5 w-full">
      {/* Client Details */}
      <div className="w-full">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <p className="font-semibold text-md text-maroon-600">
              Client Details
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="flex flex-col col-span-1 md:col-span-2">
              <FormInput
                control={control}
                name={"client_name"}
                label={"Client Name"}
                inputType={"search"}
                register={register}
                placeholder="Select Client"
                required={true}
                items={clientItems}
                onSelect={(item: ClientItem) => {
                  console.log("Selected item:", item);
                  console.log("Setting client_id:", Number(item.value));
                  // Convert the string id to a number for client_id
                  setValue("client_id", Number(item.value));
                  setValue("client_name", item.label);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Title */}
      <div className="w-full">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <p className="font-semibold text-md text-maroon-600">
              Project Title
            </p>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="flex flex-col col-span-1 md:col-span-2">
                <FormInput
                  name={"project_title"}
                  label={"Project Title"}
                  inputType={"default"}
                  register={register}
                  required={true}
                  placeholder="Enter Project Title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Location */}
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-semibold text-md text-maroon-600">
              Project Location
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {/* State */}
            <FormInput
              name={"state"}
              label={"State"}
              inputType={"default"}
              register={register}
              placeholder="Enter State"
              required={true}
            />
            {/* City/Town */}
            <FormInput
              name={"city_town"}
              label={"City/Town"}
              inputType={"default"}
              placeholder="Enter City/Town"
              register={register}
              required={true}
            />
            {/* Street */}
            <FormInput
              name={"street"}
              label={"Street"}
              inputType={"default"}
              placeholder="Enter Street"
              register={register}
              required={true}
            />
            {/* Zip Code */}
            <FormInput
              name={"zip_code"}
              label={"Zip Code"}
              inputType={"default"}
              placeholder="Enter Zip Code"
              register={register}
              required={true}
            />
          </div>
        </div>
      </div>

      {/* Project Date */}
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-semibold text-md text-maroon-600">
              Project Date
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            <FormInput
              name="start_date"
              label="Start Date"
              inputType="date"
              control={control}
              validationRules={{
                required: requireError("Start Date"),
                validate: (value: string) => {
                  if (!value) return "Start Date is required";
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  // Check if date is valid
                  if (isNaN(selectedDate.getTime())) {
                    return "Invalid date format";
                  }

                  return (
                    selectedDate > today || "Start Date must be in the future"
                  );
                },
              }}
              errorMessage={errors.start_date?.message}
            />

            <FormInput
              name="end_date"
              label="End Date"
              inputType="date"
              control={control}
              validationRules={{
                required: requireError("End Date"),
                validate: (value: string) => {
                  if (!value) return "End Date is required";
                  const selectedDate = new Date(value);
                  const startDateValue = watch("start_date");

                  if (!startDateValue) return true; // Wait for start date to be filled
                  const startDate = new Date(startDateValue);

                  // Check if dates are valid
                  if (
                    isNaN(selectedDate.getTime()) ||
                    isNaN(startDate.getTime())
                  ) {
                    return "Invalid date format";
                  }

                  return (
                    selectedDate > startDate ||
                    "End Date must be later than Start Date"
                  );
                },
              }}
              errorMessage={errors.end_date?.message}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
