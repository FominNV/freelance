import { tuple } from '../../lib/types';

export const checkBoxSizesList = tuple('sm', 'md', 'lg');
export type CheckboxSizesType = typeof checkBoxSizesList[number];
