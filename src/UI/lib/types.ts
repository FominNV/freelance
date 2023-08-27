export const tuple = <T extends string[]>(...args: T): T => args;
export type ValuesOf<T extends any[]>= T[number];
export type KeysOfObject<T extends { [K in string | number]: unknown }> = keyof T;
