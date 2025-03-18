export type IsOptionalField<T, K extends keyof T> = undefined extends T[K]
  ? object extends Pick<T, K>
    ? true
    : false
  : false;

export type PickOptionals<T> = {
  [K in keyof T as IsOptionalField<T, K> extends true ? K : never]: T[K];
};

export type PickRequired<T> = {
  [K in keyof T as IsOptionalField<T, K> extends false ? K : never]: T[K];
};

export type MapObjectValue<T, U> = {
  [K in keyof PickOptionals<T>]?: U;
} & {
  [K in keyof PickRequired<T>]: U;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};
