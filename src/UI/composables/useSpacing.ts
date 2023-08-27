import { computed } from 'vue';
import { tuple } from '../lib/types';

export const SpacingSizesList = tuple('0', '0-25', '0-5', '0-75', '1', '1-5', '2', '2-5', '3', '4', '5', '6', '8', '9', '10', '12-5', '15');

export type SpacingSizesType = typeof SpacingSizesList[number];

export function useSpacing(
  left: SpacingSizesType | null = null,
  top: SpacingSizesType | null = null,
  right: SpacingSizesType | null = null,
  bottom: SpacingSizesType | null = null,
  type: 'inner' | 'outer' = 'outer',
) {
  const spacingType = type === 'inner' ? 'padding' : 'margin';
  const offsetStyles = computed(() => ({
    [`${spacingType}-top`]: top ? `var(--spacing-${top})` : undefined,
    [`${spacingType}-right`]: right ? `var(--spacing-${right})` : undefined,
    [`${spacingType}-bottom`]: bottom ? `var(--spacing-${bottom})` : undefined,
    [`${spacingType}-left`]: left ? `var(--spacing-${left})` : undefined,
  }));
  return { offsetStyles };
}

export function useGapSpacing(
  size: SpacingSizesType | null = null,
) {
  if (!size) {
    return {};
  }

  return computed(() => ({
    gap: `var(--spacing-${size}) var(--spacing-${size})`,
  }));
}
