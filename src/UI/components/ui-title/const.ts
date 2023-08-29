import { tuple } from '../../lib/types';

export const titleSizesList = tuple('sm');

export type TitleSizesType = typeof titleSizesList[number];
