import { PropsSizeType, DefaultSizesListType, SizesListType } from '../@types/size';

export function useSize<T extends string = DefaultSizesListType>(value: PropsSizeType<T>, list: SizesListType<T>): string {
  if (Object.keys(list).includes(value)) {
    return list[value as keyof typeof list];
  }
  return value;
}
