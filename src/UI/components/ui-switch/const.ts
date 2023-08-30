import { tuple } from '../../lib/types';

export const switchSizesList = tuple('sm', 'md', 'lg');

export type SwitchSizesType = typeof switchSizesList[number];
