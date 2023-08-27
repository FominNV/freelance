import { tuple } from '../../lib/types';

export const alertSizes = tuple('md', 'lg');
export type AlertSizesType = typeof alertSizes[number];
