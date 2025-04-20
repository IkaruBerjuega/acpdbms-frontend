export type ProjectFormSchemaType = {
  client_id?: number;
  client_name: string;
  project_title: string;
  project_description: string;
  state: string;
  city_town: string;
  street: string;
  zip_code?: string;
  start_date?: string;
  end_date?: string;
  finish_date?: string;
  status: string;
  image_url: string;
};

export interface ProjectUpdateRequest {
  project_title: string;
  project_description: string;
  state: string;
  city_town: string;
  street: string;
  zip_code?: string;
  start_date?: string;
  end_date?: string;
}
