import { tuple } from '../../lib/types';

export const buttonThemes = tuple('default', 'primary', 'ghost', 'default-outlined', 'primary-outlined', 'toolbar', 'success', 'success-outlined', 'warning', 'warning-outlined', 'error', 'error-outlined');

export const buttonShapes = tuple('normal', 'circle', 'square');
export const buttonSizes = tuple('sm', 'md', 'lg');

export type ButtonThemesType = typeof buttonThemes[number];
export type ButtonShapesType = typeof buttonShapes[number];
export type ButtonSizesType = typeof buttonSizes[number];
