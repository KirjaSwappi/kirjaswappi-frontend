export type TPoint = string;

export type TChild = {
  subHeading?: string;
  points?: TPoint[];
};

export type TCategorySection = {
  id: number;
  category: string;
  Mobilecategory: string;
  title: string;
  paragraph?: string;
  children?: TChild[];
};
