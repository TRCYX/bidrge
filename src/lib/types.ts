export type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type RecursivePartial<T> = {
  [K in keyof T]?:
  T[K] extends (infer E)[] ? RecursivePartial<E>[] :
  T[K] extends object ? RecursivePartial<T[K]> :
  T[K];
};
