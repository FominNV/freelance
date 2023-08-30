import { tuple } from '../../lib/types';

export const cardThemes = tuple('default', 'light', 'dark', 'ghost');
export const cardSizes = tuple('sm', 'md', 'lg');

export type CardThemesType = typeof cardThemes[number];
export type CardSizesType = typeof cardSizes[number];
