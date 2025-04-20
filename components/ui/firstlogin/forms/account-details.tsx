"use client";
import { useFormContext } from "react-hook-form";
import FormInput from "../../general/form-components/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { firstLogin } from "@/lib/form-constants/form-constants";
import { requireError } from "@/lib/utils";

export default function AccDetails() {
  const { register } = useFormContext<firstLogin>();

  return (
    <Card className="border-none shadow-md w-auto md:min-w-[414px] md:min-h-[468px]">
      <CardContent className="p-8">
        <div>
          <p className="font-semibold text-md text-primary w-full">
            Account Details
          </p>
        </div>
        <div className="flex flex-col w-full gap-4 mt-4">
          <FormInput
            name="email"
            label="Email"
            inputType="default"
            register={register}
            readOnly={true}
          />
          <FormInput
            name="first_name"
            label="First Name"
            inputType="default"
            register={register}
            validationRules={{ required: requireError("First Name") }}
            required={true}
          />
          <FormInput
            name="middle_name"
            label="Middle Name"
            inputType="default"
            register={register}
            validationRules={{ required: requireError("Middle Name") }}
            required={true}
          />
          <FormInput
            name="last_name"
            label="Last Name"
            inputType="default"
            register={register}
            validationRules={{ required: requireError("Last Name") }}
            required={true}
          />
          <FormInput
            name="phone_number"
            label="Phone Number"
            inputType="default"
            placeholder="(202) 555-0136"
            dataType="number"
            register={register}
            validationRules={{
              valueAsNumber: true,
              required: requireError("Phone Number"),
            }}
            required={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
