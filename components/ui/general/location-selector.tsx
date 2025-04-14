import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UseFormReturn } from 'react-hook-form';
import FormInput from './form-components/form-input';
import { adminUpdateProfile } from '@/lib/form-constants/form-constants';

type FormValues = Pick<adminUpdateProfile, 'state' | 'city_town' | 'zip_code'>;

type USLocationSelectorProps = {
  control: UseFormReturn<FormValues>;
  stateFieldName: keyof FormValues;
  cityFieldName: keyof FormValues;
  zipcodeFieldName: keyof FormValues;
  onStateChange?: (state: string) => void;
  onCityChange?: (city: string) => void;
  onZipcodeChange?: (zipcode: string) => void;
};

interface StateItem {
  name: string;
}

interface CityItem {
  name: string;
}

interface Place {
  'place name': string;
  'state abbreviation': string;
  'post code': string;
  latitude: string;
  longitude: string;
}

interface ZipInfo {
  'country abbreviation': string;
  places: Place[];
  country: string;
  'place name': string;
  state: string;
  'state abbreviation': string;
}

// --- Static Mapping from State Name to ISO Code ---
const stateNameToCode: { [key: string]: string } = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

//  fetch data

async function getUSStates(): Promise<StateItem[]> {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/states',
      { country: 'United States' }
    );
    return response.data.data.states;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}

async function getCitiesForState(state: string): Promise<CityItem[]> {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/state/cities',
      { country: 'United States', state }
    );
    const cityNames: string[] = response.data.data;
    return cityNames.map((name) => ({ name }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

async function getZipcodesForCity(
  state: string,
  city: string
): Promise<string[]> {
  try {
    const stateCode = stateNameToCode[state];
    if (!stateCode) {
      console.error('No state code found for', state);
      return [];
    }
    const response = await axios.get<ZipInfo>(
      `http://api.zippopotam.us/us/${stateCode}/${encodeURIComponent(city)}`
    );
    if (response.data && response.data.places) {
      // Map over the places to extract each 'post code'.
      return response.data.places.map((place) => place['post code']);
    }
    return [];
  } catch (error) {
    console.error('Error fetching zip codes:', error);
    return [];
  }
}

export default function USLocationSelector({
  control,
  stateFieldName,
  cityFieldName,
  zipcodeFieldName,
  onStateChange,
  onCityChange,
  onZipcodeChange,
}: USLocationSelectorProps) {
  const { control: formControl, setValue } = control;

  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [zipcodes, setZipcodes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Load states on mount.
  useEffect(() => {
    async function loadStates() {
      const usStates = await getUSStates();
      setStates(usStates);
    }
    loadStates();
  }, []);

  // When a state is selected, load its cities.
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

  // When a city is selected, load the zip codes.
  useEffect(() => {
    async function loadZipcodes() {
      if (!selectedState || !selectedCity) {
        setZipcodes([]);
        return;
      }
      const zips = await getZipcodesForCity(selectedState, selectedCity);
      console.log('Fetched zip codes:', zips);
      setZipcodes(zips);
      // Auto-select if there's only one result
      if (zips.length === 1) {
        if (onZipcodeChange) onZipcodeChange(zips[0]);
        setValue(zipcodeFieldName, zips[0]);
      }
    }
    loadZipcodes();
  }, [
    selectedState,
    selectedCity,
    onZipcodeChange,
    setValue,
    zipcodeFieldName,
  ]);

  return (
    <div className='w-full grid grid-cols-1 gap-6 lg:grid-cols-3'>
      {/* State Dropdown */}
      <div className='col-span-1'>
        <FormInput
          className='min-w-[230px]'
          control={formControl}
          name={stateFieldName}
          label='State'
          inputType='search'
          items={states.map((st, idx) => ({
            key: `${st.name}-${idx}`,
            value: st.name,
            label: st.name,
          }))}
          placeholder='Select State'
          validationRules={{ required: 'State is required' }}
          onSelect={(item) => {
            if (item) {
              const selectedValue = item.label?.toString() || '';
              setValue(stateFieldName, selectedValue);
              setSelectedState(item.value?.toString() || '');

              setSelectedCity('');
              if (onStateChange) onStateChange(selectedValue);
            }
          }}
        />
      </div>
      <div className='col-span-1'>
        {/* City / Town Dropdown */}
        <FormInput
          className='min-w-[230px]'
          control={formControl}
          name={cityFieldName}
          label='City / Town'
          inputType='search'
          items={cities.map((ct, idx) => ({
            key: `${ct.name}-${idx}`,
            value: ct.name,
            label: ct.name,
          }))}
          placeholder='Select City/Town'
          validationRules={{ required: 'City is required' }}
          onSelect={(item) => {
            if (item) {
              const selectedCityValue = item.label?.toString() || '';
              setValue(cityFieldName, selectedCityValue);
              setSelectedCity(item.value?.toString() || '');
              if (onCityChange) onCityChange(selectedCityValue);
            }
          }}
        />
      </div>

      <div className='col-span-1'>
        {/* Zip Code Dropdown */}
        <FormInput
          className='min-w-[230px]'
          control={formControl}
          name={zipcodeFieldName}
          label='Zip Code'
          inputType='search'
          items={zipcodes.map((zip, idx) => ({
            key: `${zip}-${idx}`,
            value: zip,
            label: zip,
          }))}
          placeholder='Select Zip Code'
          validationRules={{ required: 'Zip code is required' }}
          onSelect={(item) => {
            if (item) {
              const selectedZip = item.label?.toString() || '';
              setValue(zipcodeFieldName, selectedZip);
              if (onZipcodeChange) onZipcodeChange(selectedZip);
            }
          }}
        />
      </div>
    </div>
  );
}
