import { SizesListType } from '../../@types/size';
import { tuple } from '../../lib/types';

export const iconTypes = tuple('component', 'sprite');

export const iconSizesList = tuple('xs', 'sm', 'md', 'lg', 'xl');

export type IconSizesType = typeof iconSizesList[number];

export const iconSizes: SizesListType<IconSizesType> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

export type IconTypesType = typeof iconTypes[number];
