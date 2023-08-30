import { tuple } from '../../lib/types';

export const inputSizesList = tuple('sm', 'lg');

export type InputSizesType = typeof inputSizesList[number];
