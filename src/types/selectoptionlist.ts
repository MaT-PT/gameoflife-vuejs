type SelectOptionText = {
  text: string;
  value?: string | number | object;
  disabled?: boolean;
};

type SelectOptionHtml = {
  html: string;
  value: string | number | object;
  disabled?: boolean;
};

type SelectOptionGroup = {
  label: string;
  options: SelectOptionList;
};

export type SelectOptionList = (
  | SelectOptionText
  | SelectOptionHtml
  | SelectOptionGroup
)[];
