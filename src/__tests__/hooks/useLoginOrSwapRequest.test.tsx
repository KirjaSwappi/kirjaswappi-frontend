import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoginModalOrSwapRequest } from '../../hooks/useLoginOrSwapRequest';
import { ISwapBookInformation } from '../../redux/feature/swap/types/interface';

// Mock Redux hooks
const mockDispatch = vi.fn();
const mockUseAppDispatch = vi.fn(() => mockDispatch);
const mockUseAppSelector = vi.fn();

vi.mock('../../redux/hooks', () => ({
  useAppDispatch: () => mockUseAppDispatch(),
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

// Mock Redux actions
vi.mock('../../redux/feature/open/openSlice', () => ({
  setLoginModalOpen: vi.fn((value: boolean) => ({ type: 'open/setLoginModalOpen', payload: value })),
}));

vi.mock('../../redux/feature/swap/swapSlice', () => ({
  setSwapModal: vi.fn((value: boolean) => ({ type: 'swap/setSwapModal', payload: value })),
  setSwapBook: vi.fn((bookData: ISwapBookInformation) => ({ type: 'swap/setSwapBook', payload: bookData })),
  setBookIdToSwapWith: vi.fn((id: string) => ({ type: 'swap/setBookIdToSwapWith', payload: id })),
}));

// Import the mocked functions
import { setLoginModalOpen } from '../../redux/feature/open/openSlice';
import { setSwapModal, setSwapBook, setBookIdToSwapWith } from '../../redux/feature/swap/swapSlice';

describe('useLoginModalOrSwapRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return handleLoginOrSwap function', () => {
    mockUseAppSelector.mockReturnValue({ userInformation: null });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());
    expect(result.current.handleLoginOrSwap).toBeInstanceOf(Function);
  });

  it('should open login modal when user is not logged in', () => {
    mockUseAppSelector.mockReturnValue({ userInformation: null });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());

    act(() => {
      result.current.handleLoginOrSwap();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setLoginModalOpen(true));
    expect(mockDispatch).not.toHaveBeenCalledWith(setSwapModal(true));
  });

  it('should open swap modal when user is logged in', () => {
    mockUseAppSelector.mockReturnValue({
      userInformation: { email: 'test@example.com' }
    });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());

    act(() => {
      result.current.handleLoginOrSwap();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));
    expect(mockDispatch).not.toHaveBeenCalledWith(setLoginModalOpen(true));
  });

  it('should set swap book data when user is logged in and bookData is provided', () => {
    const mockBookData: ISwapBookInformation = {
      id: 'book-123',
      title: 'Test Book',
      author: 'Test Author',
      condition: 'Good',
      images: [],
      genre: 'Fiction',
      description: 'Test description',
      location: 'Test location',
      userId: 'user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUseAppSelector.mockReturnValue({
      userInformation: { email: 'test@example.com' }
    });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());

    act(() => {
      result.current.handleLoginOrSwap(mockBookData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));
    expect(mockDispatch).toHaveBeenCalledWith(setSwapBook(mockBookData));
  });

  it('should set book ID to swap with when user is logged in and id is provided', () => {
    const bookId = 'book-456';

    mockUseAppSelector.mockReturnValue({
      userInformation: { email: 'test@example.com' }
    });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());

    act(() => {
      result.current.handleLoginOrSwap(undefined, bookId);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));
    expect(mockDispatch).toHaveBeenCalledWith(setBookIdToSwapWith(bookId));
  });

  it('should set both book data and ID when both are provided and user is logged in', () => {
    const mockBookData: ISwapBookInformation = {
      id: 'book-123',
      title: 'Test Book',
      author: 'Test Author',
      condition: 'Good',
      images: [],
      genre: 'Fiction',
      description: 'Test description',
      location: 'Test location',
      userId: 'user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const bookId = 'book-456';

    mockUseAppSelector.mockReturnValue({
      userInformation: { email: 'test@example.com' }
    });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());

    act(() => {
      result.current.handleLoginOrSwap(mockBookData, bookId);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));
    expect(mockDispatch).toHaveBeenCalledWith(setSwapBook(mockBookData));
    expect(mockDispatch).toHaveBeenCalledWith(setBookIdToSwapWith(bookId));
  });

  it('should not dispatch swap actions when user is not logged in, even with parameters', () => {
    const mockBookData: ISwapBookInformation = {
      id: 'book-123',
      title: 'Test Book',
      author: 'Test Author',
      condition: 'Good',
      images: [],
      genre: 'Fiction',
      description: 'Test description',
      location: 'Test location',
      userId: 'user-123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const bookId = 'book-456';

    mockUseAppSelector.mockReturnValue({ userInformation: null });

    const { result } = renderHook(() => useLoginModalOrSwapRequest());

    act(() => {
      result.current.handleLoginOrSwap(mockBookData, bookId);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setLoginModalOpen(true));
    expect(mockDispatch).not.toHaveBeenCalledWith(setSwapModal(true));
    expect(mockDispatch).not.toHaveBeenCalledWith(setSwapBook(mockBookData));
    expect(mockDispatch).not.toHaveBeenCalledWith(setBookIdToSwapWith(bookId));
  });

  it('should memoize the handleLoginOrSwap function with useCallback', () => {
    mockUseAppSelector.mockReturnValue({
      userInformation: { email: 'test@example.com' }
    });

    const { result, rerender } = renderHook(() => useLoginModalOrSwapRequest());

    const firstFunction = result.current.handleLoginOrSwap;

    // Rerender should return the same function reference due to useCallback
    rerender();
    const secondFunction = result.current.handleLoginOrSwap;

    expect(firstFunction).toBe(secondFunction);
  });

  it('should update function when user information changes', () => {
    const { result, rerender } = renderHook(() => useLoginModalOrSwapRequest());

    mockUseAppSelector.mockReturnValue({ userInformation: null });
    const firstFunction = result.current.handleLoginOrSwap;

    // Change user information
    mockUseAppSelector.mockReturnValue({
      userInformation: { email: 'test@example.com' }
    });
    rerender();

    const secondFunction = result.current.handleLoginOrSwap;

    // Function should be different due to useCallback dependency change
    expect(firstFunction).not.toBe(secondFunction);
  });
});