"use client";

import { useFormContext } from "react-hook-form";
import FormInput from "../../general/form-components/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { firstLogin } from "@/lib/form-constants/form-constants";
import USLocationSelector from "../../general/location-selector";

export function Address() {
  const { register, control, setValue } = useFormContext<firstLogin>();

  return (
    <Card className="border-none shadow-md w-auto md:min-w-[414px] md:min-h-[468px]">
      <CardContent className="p-8">
        <div>
          <p className="font-semibold text-md text-primary w-full">Address</p>
        </div>
        <div className="flex flex-col w-full gap-4 mt-4">
          <USLocationSelector
            control={control}
            stateFieldName={`state`}
            cityFieldName={`city_town`}
            zipcodeFieldName={`zip_code`}
            onStateChange={(state) => console.log("State changed:", state)}
            onCityChange={(city) => console.log("City changed:", city)}
            onZipcodeChange={(zipcode) =>
              console.log("Zipcode changed:", zipcode)
            }
            setValue={setValue}
          />
          <FormInput
            name={`street`}
            label="Street"
            inputType="default"
            placeholder="Ex. 123 Sunset Blvd"
            register={register}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
