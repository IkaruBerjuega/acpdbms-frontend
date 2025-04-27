import React, { useState, useEffect } from "react";
import {
  Path,
  PathValue,
  UseFormSetValue,
  Control,
  FieldValues,
} from "react-hook-form";
import FormInput from "./form-components/form-input";
import {
  CityItem,
  getCitiesForState,
  getUSStates,
  getZipcodesForCity,
  StateItem,
} from "@/hooks/general/use-location-selector";

type USLocationSelectorProps<T extends FieldValues> = {
  control: Control<T, any>; // eslint-disable-line
  stateFieldName: Path<T>;
  cityFieldName: Path<T>;
  zipcodeFieldName: Path<T>;
  onStateChange?: (state: string) => void;
  onCityChange?: (city: string) => void;
  onZipcodeChange?: (zipcode: string) => void;
  setValue: UseFormSetValue<T>;
};

export default function USLocationSelector<T extends FieldValues>({
  control: formControl,
  stateFieldName,
  cityFieldName,
  zipcodeFieldName,
  onStateChange,
  onCityChange,
  setValue,
  onZipcodeChange,
}: USLocationSelectorProps<T>) {
  const [states, setStates] = useState<StateItem[] | null>([]);
  const [cities, setCities] = useState<CityItem[] | null>([]);
  const [zipcodes, setZipcodes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [disableZipCode, setDisableZipCode] = useState<boolean>(false);

  useEffect(() => {
    async function loadStates() {
      const usStates = await getUSStates();
      setStates(usStates);
    }
    loadStates();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (!selectedState) {
        setCities(null);
        return;
      }
      const stateCities = await getCitiesForState(selectedState);
      setCities(stateCities);
    }
    loadCities();
  }, [selectedState]);

  useEffect(() => {
    async function loadZipcodes() {
      // select state and city_town first before zipcode to
      if (!selectedState || !selectedCity) {
        setZipcodes([]);
        return;
      }

      const { response, error } = await getZipcodesForCity(
        selectedState,
        selectedCity
      );

      if (error) {
        setDisableZipCode(true);
        setValue(zipcodeFieldName, "N/A" as PathValue<T, Path<T>>);
        return;
      }

      setDisableZipCode(false);
      setZipcodes(response);

      if (response.length === 1) {
        const zip = response[0];
        onZipcodeChange?.(zip);
      }
    }

    loadZipcodes();
  }, [selectedCity, zipcodeFieldName, setValue, onZipcodeChange]);

  return (
    <>
      <FormInput
        className="min-w-[230px]"
        control={formControl}
        name={stateFieldName}
        label="State"
        inputType="search"
        items={
          states?.map((st, idx) => ({
            key: `${st.name}-${idx}`,
            value: st.name,
            label: st.name,
          })) || []
        }
        placeholder="Select State"
        validationRules={{ required: "State is required" }}
        onSelect={(item) => {
          if (item) {
            const selectedValue = item.label?.toString() || "";
            setValue(stateFieldName, selectedValue as PathValue<T, Path<T>>);
            setSelectedState(item.value?.toString() || "");

            // Reset city
            setSelectedCity("");
            onStateChange?.(selectedValue);
          }
        }}
        clearFn={() => {
          setValue(stateFieldName, null as PathValue<T, Path<T>>);
          setValue(cityFieldName, null as PathValue<T, Path<T>>);
          setValue(zipcodeFieldName, null as PathValue<T, Path<T>>);
        }}
      />

      <FormInput
        className="min-w-[230px]"
        control={formControl}
        name={cityFieldName}
        label="City / Town"
        inputType="search"
        items={
          cities?.map((ct, idx) => ({
            key: `${ct.name}-${idx}`,
            value: ct.name,
            label: ct.name,
          })) || []
        }
        placeholder="Select City/Town"
        validationRules={{ required: "City is required" }}
        onSelect={(item) => {
          if (item) {
            const selectedCityValue = item.label?.toString() || "";
            setValue(cityFieldName, selectedCityValue as PathValue<T, Path<T>>);
            setSelectedCity(item.value?.toString() || "");
            onCityChange?.(selectedCityValue);
          }
        }}
        clearFn={() => {
          setValue(cityFieldName, null as PathValue<T, Path<T>>);
          setValue(zipcodeFieldName, null as PathValue<T, Path<T>>);
          setDisableZipCode(false);
        }}
      />

      <FormInput
        key={`zipcode-${disableZipCode}-${zipcodes.length}`}
        className="min-w-[230px]"
        control={formControl}
        name={zipcodeFieldName}
        label="Zip Code"
        required={false}
        disabled={disableZipCode}
        inputType="search"
        items={
          zipcodes.map((zip, idx) => ({
            key: `${zip}-${idx}`,
            value: zip,
            label: zip,
          })) || []
        }
        placeholder="Select Zip Code"
        onSelect={(item) => {
          if (item) {
            const selectedZip = item.label?.toString() || "";
            setValue(zipcodeFieldName, selectedZip as PathValue<T, Path<T>>);
            onZipcodeChange?.(selectedZip);
          }
        }}
      />
    </>
  );
}
