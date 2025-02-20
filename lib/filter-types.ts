//used for combobox item interface
export interface ItemInterface {
  value: string;
  label: string;
  element?: JSX.Element;
  highlight?: { initialColor: string; hoverColor: string };
}

export interface FilterType {
  name: string;
  type: string;
  options: string[];
  columnAccessor: string;
}
