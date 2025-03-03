export type ContactFormSchemaType = {
  name: string;
  email: string;
  message: string;
};

export type AccountActionSchemaType = {
  user_ids: number[];
};

export type AccountSendLinkSchemaType = {
  email: string;
};

export type AccountActionsRequest =
  | AccountActionSchemaType
  | AccountSendLinkSchemaType;

export type LoginSchemaType = {
  email: string;
  password: string;
};
