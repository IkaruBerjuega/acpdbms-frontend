// use-location-selector.ts
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export interface StateItem {
  name: string;
}

export interface CityItem {
  name: string;
}

export interface Place {
  "place name": string;
  "state abbreviation": string;
  "post code": string;
  latitude: string;
  longitude: string;
}

export interface ZipInfo {
  "country abbreviation": string;
  places: Place[];
  country: string;
  "place name": string;
  state: string;
  "state abbreviation": string;
}

// --- Static Mapping from State Name to ISO Code ---
export const stateNameToCode: { [key: string]: string } = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

export async function getUSStates(): Promise<StateItem[]> {
  try {
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      { country: "United States" }
    );
    return response.data.data.states;
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
}

export async function getCitiesForState(
  state: string
): Promise<CityItem[] | null> {
  try {
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      { country: "United States", state }
    );
    const cityNames: string[] = response.data.data;
    return cityNames.map((name) => ({ name }));
  } catch (error) {
    console.error("Error fetching cities:", error);
    return null;
  }
}

export async function getZipcodesForCity(
  state: string,
  city: string
): Promise<{ response: string[]; error: boolean }> {
  try {
    const stateCode = stateNameToCode[state];
    if (!stateCode) {
      console.error("No state code found for", state);
      return { response: [], error: false };
    }
    const response = await axios.get<ZipInfo>(
      `https://api.zippopotam.us/us/${stateCode}/${encodeURIComponent(city)}`
    );

    const _response = response.data.places?.map((p) => p["post code"]) ?? [];

    return { response: _response, error: false };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { response: [], error: true };
    }
    return { response: [], error: true };
  }
}
