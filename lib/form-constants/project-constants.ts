import { z } from 'zod';

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

export const step1Schema = z.object({
  id: z.coerce.number(),
  client_id: z.coerce.number().optional(),
  client_name: z
    .string({ required_error: 'Client Name is Required' })
    .min(1, { message: 'Client Name is required' }),
  project_title: z.string().min(1, { message: 'Project Title is required' }),
  start_date: z
    .date({ required_error: 'Start Date is required' })
    .refine((data) => data > new Date(), {
      message: 'Start date must be in the future',
    }),
  end_date: z
    .date({ required_error: 'End Date is required' })
    .refine((data) => data > new Date(), {
      message: 'End date must be in the future',
    }),
  finish_date: z
    .date({ required_error: 'Finish Date is required' })
    .refine((data) => data > new Date(), {
      message: 'Finish date must be in the future',
    }),
  status: z.string(),
  street: z
    .string({ required_error: 'Street is required' })
    .min(1, { message: 'Street is required' }),
  city_town: z
    .string({ required_error: 'City/Town is required' })
    .min(1, { message: 'City/Town is required' }),
  state: z
    .string({ required_error: 'State is required' })
    .min(1, { message: 'State is required' }),
  zip_code: z.coerce
    .number({ message: 'Invalid Input. Enter a number' })
    .gte(1, { message: 'Zip Code is required' }),
  image_url: z.string(),
});

export type ProjectDetailsType = z.infer<typeof step1Schema>;
