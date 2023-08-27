import { tuple } from '../../lib/types';
export const badgeThemes = tuple('default', 'success', 'warning', 'error');
export type BadgeThemesType = typeof badgeThemes[number];