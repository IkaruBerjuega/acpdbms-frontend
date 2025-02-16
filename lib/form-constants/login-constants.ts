export const loginSchema = {
  email: {
    required: 'Email is required',
  },
  password: {
    required: 'Password is required',
  },
};

export type LoginSchemaType = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
