import { tuple } from '../../lib/types';

export const inputNumberSizesList = tuple('sm', 'md', 'lg');

export type InputNumberSizesType = typeof inputNumberSizesList[number];
