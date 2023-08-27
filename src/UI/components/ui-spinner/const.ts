import { SizesListType } from '../../@types/size';
import { tuple } from '../../lib/types';

export const spinnerSizesList = tuple('xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl');

export const spinnerTypes = tuple('fading-balls', 'rounded-blocks', 'two-arrows', 'spinning-arrow', 'three-dots', 'tail-spin', 'spinner-loader');

export type SpinnerSizesType = typeof spinnerSizesList[number];
export type SpinnerTypesType = typeof spinnerTypes[number];

export const spinnerSizes: SizesListType<SpinnerSizesType> = {
  xxs: '12px',
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '36px',
  xl: '48px',
  xxl: '64px',
};
