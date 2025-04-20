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
import axios from "axios";

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
  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [zipcodes, setZipcodes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

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
        setCities([]);
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

      try {
        const zips = await getZipcodesForCity(selectedState, selectedCity);
        setZipcodes(zips);
        if (zips.length === 1) {
          const zip = zips[0];
          setValue(zipcodeFieldName, zip as PathValue<T, Path<T>>);
          onZipcodeChange?.(zip);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setZipcodes([]);
        } else {
          console.error("Zipcode lookup failed:", err);
          throw err;
        }
      }
    }

    loadZipcodes();
  }, [
    selectedState,
    selectedCity,
    zipcodeFieldName,
    setValue,
    onZipcodeChange,
  ]);

  // checking the empty array
  useEffect(() => {
    console.log(
      `🔍 zipcodes for "${selectedState}" / "${selectedCity}" =>`,
      zipcodes
    );
  }, [selectedState, selectedCity, zipcodes]);

  return (
    <>
      <FormInput
        className="min-w-[230px]"
        control={formControl}
        name={stateFieldName}
        label="State"
        inputType="search"
        items={states.map((st, idx) => ({
          key: `${st.name}-${idx}`,
          value: st.name,
          label: st.name,
        }))}
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
      />

      <FormInput
        className="min-w-[230px]"
        control={formControl}
        name={cityFieldName}
        label="City / Town"
        inputType="search"
        items={cities.map((ct, idx) => ({
          key: `${ct.name}-${idx}`,
          value: ct.name,
          label: ct.name,
        }))}
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
      />

      <FormInput
        className="min-w-[230px]"
        control={formControl}
        name={zipcodeFieldName}
        label="Zip Code"
        required={false}
        inputType="search"
        items={zipcodes.map((zip, idx) => ({
          key: `${zip}-${idx}`,
          value: zip,
          label: zip,
        }))}
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
