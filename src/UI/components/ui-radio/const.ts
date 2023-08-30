import { tuple } from '../../lib/types';

export const radioSizesList = tuple('sm', 'md', 'lg');
export type RadioSizesType = typeof radioSizesList[number];
