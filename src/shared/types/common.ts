export type OptionType = { label: string; value: unknown };

export type SelectOption = { label: string; value: string };

export type StringPropertyKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type StringOrNullPropertyKeys<T> = {
  [K in keyof T]: T[K] extends string | null ? K : never;
}[keyof T];

export type DatePropertyKeys<T> = {
  [K in keyof T]: T[K] extends Date ? K : never;
}[keyof T];

export type BooleanPropertyKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export type BooleanOrNullPropertyKeys<T> = {
  [K in keyof T]: T[K] extends boolean | null ? K : never;
}[keyof T];

export type NumberPropertyKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type ObjectValues<T> = T[keyof T];
