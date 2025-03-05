export type ProjectFormSchemaType = {
  client_id?: number;
  client_name: string;
  project_title: string;
  state: string;
  city_town: string;
  street: string;
  zip_code?: number;
  start_date?: Date;
  end_date?: Date;
  status: string;
  image_url: string;
};
