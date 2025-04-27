import { useFormContext } from "react-hook-form";
import { useAccounts } from "@/hooks/api-calls/admin/use-account";
import FormInput from "../../../general/form-components/form-input";
import { ProjectFormSchemaType } from "@/lib/form-constants/project-constants";
import { ClientInterface } from "@/lib/definitions";
import { requireError } from "@/lib/utils";
import USLocationSelector from "@/components/ui/general/location-selector";

type StepInputs = ProjectFormSchemaType;

interface ClientItem {
  value: string | number;
  label: string;
}

export default function ProjectDetails() {
  // form control using react-hook-form context
  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useFormContext<StepInputs>();

  const { data } = useAccounts<ClientInterface>({
    role: "client",
    isArchived: false,
  });

  // map clientAccounts to the items expected by FormInput
  const clientItems: ClientItem[] =
    data?.map((client: ClientInterface) => ({
      value: String(client.id), // id is a string
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
                items={clientItems}
                placeholder="Ex. John Doe"
                onSelect={(item: ClientItem) => {
                  console.log("Selected item:", item);
                  console.log("Setting client_id:", Number(item.value));
                  // Convert the string id to a number for client_id
                  setValue("client_id", Number(item.value));
                  setValue("client_name", item.label);
                }}
                clearFn={() => {
                  // Convert the string id to a number for client_id
                  setValue("client_id", undefined);
                  setValue("client_name", "");
                }}
                validationRules={{ required: requireError("Client") }}
                errorMessage={errors.client_id?.message}
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
                  placeholder="Ex. Dela Rosa House"
                  validationRules={{ required: requireError("Project Title") }}
                  errorMessage={errors.project_title?.message}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Project Description */}
      <div className="w-full">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <p className="font-semibold text-md text-maroon-600">
              Project Description
            </p>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="flex flex-col col-span-1 md:col-span-2">
                <FormInput
                  name={"project_description"}
                  label={"Project Description"}
                  inputType={"textArea"}
                  register={register}
                  placeholder="This project..."
                  validationRules={{
                    required: requireError("Project Description"),
                  }}
                  errorMessage={errors.project_description?.message}
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
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-4 w-full">
            <USLocationSelector
              control={control}
              setValue={setValue}
              stateFieldName="state"
              cityFieldName="city_town"
              zipcodeFieldName="zip_code"
            />
            <FormInput
              name="street"
              label="Street"
              inputType="default"
              placeholder="Ex. 123 Sunset Blvd"
              register={register}
              required
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
            {/* Start Date */}
            <FormInput
              name="start_date"
              label="Start Date"
              register={register}
              control={control}
              errorMessage={errors.start_date?.message}
              validationRules={{
                required: requireError("Start Date is required"),
                validate: (value: string | number | Date) => {
                  const startDate = new Date(value);
                  const endDate = new Date(String(watch("end_date")));

                  if (
                    new Date(startDate).setHours(0, 0, 0, 0) <
                    new Date().setHours(0, 0, 0, 0)
                  ) {
                    return "Start Date must be today or in the future";
                  }

                  if (watch("end_date") && startDate >= endDate) {
                    return "Start Date must be before End Date";
                  }

                  return true;
                },
              }}
              inputType="date"
            />

            {/* End Date */}
            <FormInput
              name="end_date"
              label="End Date"
              register={register}
              control={control}
              required={false}
              errorMessage={errors.end_date?.message}
              validationRules={{
                validate: (value: string | number | Date) => {
                  const startDate = new Date(String(watch("start_date")));
                  const endDate = new Date(value);

                  if (endDate < new Date()) {
                    return "End Date must be in the future";
                  }

                  if (startDate && startDate >= endDate) {
                    return "End Date must be after Start Date";
                  }

                  return true;
                },
              }}
              inputType="date"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
