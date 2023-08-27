import { tuple } from '../lib/types';

export const defaultSizesList = tuple('xs', 'sm', 'md', 'lg');

export type DefaultSizesListType = typeof defaultSizesList[number];

export type SizesListType<T extends string = DefaultSizesListType> = Readonly<Record<T, string>>;

export type SizeType<T = DefaultSizesListType > = T;

export type PropsSizeType<T = DefaultSizesListType> =
  T extends SizeType<T> ? SizeType<T> : string;
