import {
  computed,
  watch,
  ComputedRef,
} from 'vue';
import { createGuid } from '../../lib/guid';
import {
  UiPaginationDefaultPropsImpl,
  UiPaginationPagesListItemImpl,
  UiPaginationDefaulEmitsImpl,
  UiPaginationPageSizesListItemImpl,
} from './interface';

const PagesListBuilder = (count: ComputedRef<number>, currentPage: ComputedRef<number>) => computed<Array<UiPaginationPagesListItemImpl>>(() => {
  const result: Array<UiPaginationPagesListItemImpl> = [];
  for (let i = 1; i <= count.value; i += 1) {
    result.push({
      id: createGuid(),
      title: i < 10 ? `0${i.toString()}` : i.toString(),
      selected: i === currentPage.value,
      pageNumber: i,
    });
  }
  return result;
});

const PageSizesListBuilder = (pageSizes: number[], pageSize: ComputedRef<number>) => computed<UiPaginationPageSizesListItemImpl[]>(() => {
  return pageSizes.map((size) => ({
    id: createGuid(),
    title: size.toString(),
    selected: size === pageSize.value,
    pageSize: size,
  }));
});

export function usePagination(data: UiPaginationDefaultPropsImpl, emit: UiPaginationDefaulEmitsImpl) {

  const pagesCount = computed<number>(() => {
    if (data.total === 0) {
      return 0;
    }
    return Math.ceil(data.total / data.pageSize);
  });

  const currentPage = computed<number>(() => data.modelValue);
  const currentPageSize = computed<number>(() => data.pageSize);

  const isPageNumberValid = (pageNumber: number): boolean => {
    return pageNumber >= 1 && pageNumber <= pagesCount.value;
  };

  const hasPages = computed<boolean>(() => (pagesCount.value > 1));
  const hasPrev = computed<boolean>(() => (currentPage.value > 1));
  const hasNext = computed<boolean>(() => (currentPage.value < pagesCount.value));
  const startPage = computed<number>(() => ((currentPage.value - 1) * data.pageSize + 1));
  const endPage = computed<number>(() => {
    const end = startPage.value + data.pageSize - 1;
    return end > data.total ? data.total : end;
  });

  const pagesList = PagesListBuilder(pagesCount, currentPage);
  const pageSizesList = data.pageSizes ? PageSizesListBuilder(data.pageSizes, currentPageSize) : [data.pageSize];

  const rangeChange = (): void => {
    if (!isPageNumberValid(currentPage.value)) {
      emit('update:modelValue', pagesCount.value - 1);
    } else {
      emit('range-change', startPage.value, endPage.value);
    }
  };

  const pageChange = (page: number): void => {
    if (isPageNumberValid(page)) {
      emit('update:modelValue', page);
      rangeChange();
    }
  };

  const gotoNextPage = () => {
    if (currentPage.value + 1 <= pagesCount.value) {
      pageChange(currentPage.value + 1);
    }
  };

  const gotoPrevPage = () => {
    if (currentPage.value - 1 >= 1) {
      pageChange(currentPage.value - 1);
    }
  };

  watch([() => data.total, () => data.pageSize], () => rangeChange());

  if (!isPageNumberValid(currentPage.value)) {
    pageChange(1);
  }

  return {
    emit,
    hasPages,
    hasPrev,
    hasNext,
    pagesCount,
    startPage,
    endPage,
    pagesList,
    currentPage,
    pageSizesList,
    gotoNextPage,
    gotoPrevPage,
    formatedPageNumber: (pageNumber: number) => {
      return pageNumber < 10 ? `0${pageNumber.toString()}` : pageNumber.toString();
    },
    isPageNumberValid,
    rangeChange,
    pageChange,
  };
}

export type UsePaginationResultType = ReturnType<typeof usePagination>;
