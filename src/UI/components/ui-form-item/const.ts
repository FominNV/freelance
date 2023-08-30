import { tuple } from '../../lib/types';

export const formItemSizesList = tuple('sm', 'lg', 'auto');

export type FormInputSizesType = typeof formItemSizesList[number];
