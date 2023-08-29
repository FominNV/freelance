import { tuple } from '../../lib/types';

export const datepickerSizesList = tuple('sm', 'lg');
export type DatepickerSizesType = typeof datepickerSizesList[number];
