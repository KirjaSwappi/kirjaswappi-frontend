import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useDrawerOutsideClick from '../../hooks/useDrawerOutsideClick';
import { FilterItemEnum } from '../../utility/enum';

// Mock Redux hooks
const mockDispatch = vi.fn();
const mockUseAppDispatch = vi.fn(() => mockDispatch);
const mockUseAppSelector = vi.fn();

vi.mock('../../redux/hooks', () => ({
  useAppDispatch: () => mockUseAppDispatch(),
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

// Mock Redux actions
vi.mock('../../redux/feature/filter/filterSlice', () => ({
  setFilterOpen: vi.fn((value: boolean) => ({ type: 'filter/setFilterOpen', payload: value })),
  setIsCategoryOrFilterOrSortBy: vi.fn((value: FilterItemEnum | null) => ({
    type: 'filter/setIsCategoryOrFilterOrSortBy',
    payload: value
  })),
}));

// Mock useMouseClick
const mockUseMouseClick = vi.fn();
vi.mock('../../hooks/useMouse', () => ({
  useMouseClick: (callback: () => void) => mockUseMouseClick(callback),
}));

import { setFilterOpen, setIsCategoryOrFilterOrSortBy } from '../../redux/feature/filter/filterSlice';

describe('useDrawerOutsideClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useMouseClick with a callback function', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.CATEGORY,
      isFilterOpen: true,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.CATEGORY));

    expect(mockUseMouseClick).toHaveBeenCalledTimes(1);
    expect(mockUseMouseClick).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should close filter when drawer is open and matches drawer type', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.FILTER,
      isFilterOpen: true,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.FILTER));

    // Get the callback passed to useMouseClick
    const callback = mockUseMouseClick.mock.calls[0][0];

    // Call the callback
    act(() => {
      callback();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setFilterOpen(false));
    expect(mockDispatch).toHaveBeenCalledWith(setIsCategoryOrFilterOrSortBy(null));
  });

  it('should not close filter when drawer type does not match', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.CATEGORY,
      isFilterOpen: true,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.FILTER));

    // Get the callback passed to useMouseClick
    const callback = mockUseMouseClick.mock.calls[0][0];

    // Call the callback
    act(() => {
      callback();
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(setFilterOpen(false));
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsCategoryOrFilterOrSortBy(null));
  });

  it('should not close filter when drawer is not open', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.CATEGORY,
      isFilterOpen: false,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.CATEGORY));

    // Get the callback passed to useMouseClick
    const callback = mockUseMouseClick.mock.calls[0][0];

    // Call the callback
    act(() => {
      callback();
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(setFilterOpen(false));
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsCategoryOrFilterOrSortBy(null));
  });

  it('should work with CATEGORY drawer type', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.CATEGORY,
      isFilterOpen: true,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.CATEGORY));

    const callback = mockUseMouseClick.mock.calls[0][0];

    act(() => {
      callback();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setFilterOpen(false));
    expect(mockDispatch).toHaveBeenCalledWith(setIsCategoryOrFilterOrSortBy(null));
  });

  it('should work with SORTBY drawer type', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.SORTBY,
      isFilterOpen: true,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.SORTBY));

    const callback = mockUseMouseClick.mock.calls[0][0];

    act(() => {
      callback();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setFilterOpen(false));
    expect(mockDispatch).toHaveBeenCalledWith(setIsCategoryOrFilterOrSortBy(null));
  });

  it('should return the result of useMouseClick', () => {
    const mockReturnValue = { clicked: false, setClicked: vi.fn(), reference: { current: null } };
    mockUseMouseClick.mockReturnValue(mockReturnValue);

    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: FilterItemEnum.FILTER,
      isFilterOpen: true,
    });

    const { result } = renderHook(() => useDrawerOutsideClick(FilterItemEnum.FILTER));

    expect(result.current).toBe(mockReturnValue);
  });

  it('should handle null isCategoryOrFilterOrSortBy state', () => {
    mockUseAppSelector.mockReturnValue({
      isCategoryOrFilterOrSortBy: null,
      isFilterOpen: true,
    });

    renderHook(() => useDrawerOutsideClick(FilterItemEnum.CATEGORY));

    const callback = mockUseMouseClick.mock.calls[0][0];

    act(() => {
      callback();
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(setFilterOpen(false));
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsCategoryOrFilterOrSortBy(null));
  });
});