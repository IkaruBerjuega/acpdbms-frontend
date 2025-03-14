//used for combobox item interface
export interface ItemInterface {
  value: string | number;
  label: string;
  element?: JSX.Element;
  highlight?: { initialColor: string; hoverColor: string };
}

export interface FilterType {
  filter_name: string;
  filter_type: "text" | "date" | "number" | "select";
  filter_options?: string[];
  filter_columnAccessor: string;
}
