import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useImageUpload } from '../../hooks/useImageUpload';

describe('useImageUpload', () => {
  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  const createMockEvent = (file: File): React.ChangeEvent<HTMLInputElement> => {
    return {
      target: {
        files: [file],
      },
    } as React.ChangeEvent<HTMLInputElement>;
  };

  beforeEach(() => {
    // Clear any URL.createObjectURL mocks
    URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.imageFile).toBeUndefined();
    expect(result.current.previewImage).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.isShowModal).toBe(false);
  });

  it('should handle valid JPEG file upload', () => {
    const { result } = renderHook(() => useImageUpload());
    const validFile = createMockFile('test.jpg', 1024 * 1024, 'image/jpeg'); // 1MB
    const mockEvent = createMockEvent(validFile);

    act(() => {
      result.current.handleImageFile(mockEvent);
    });

    expect(result.current.imageFile).toBe(validFile);
    expect(result.current.previewImage).toBe('mock-url');
    expect(result.current.error).toBe('');
    expect(result.current.isShowModal).toBe(false);
  });

  it('should handle valid PNG file upload', () => {
    const { result } = renderHook(() => useImageUpload());
    const validFile = createMockFile('test.png', 1024 * 500, 'image/png'); // 500KB
    const mockEvent = createMockEvent(validFile);

    act(() => {
      result.current.handleImageFile(mockEvent);
    });

    expect(result.current.imageFile).toBe(validFile);
    expect(result.current.previewImage).toBe('mock-url');
    expect(result.current.error).toBe('');
  });

  it('should reject invalid file type', () => {
    const { result } = renderHook(() => useImageUpload());
    const invalidFile = createMockFile('test.gif', 1024 * 1024, 'image/gif');
    const mockEvent = createMockEvent(invalidFile);

    act(() => {
      result.current.handleImageFile(mockEvent);
    });

    expect(result.current.imageFile).toBeUndefined();
    expect(result.current.previewImage).toBe('');
    expect(result.current.error).toBe('Please upload .jpeg or .png files. ');
    expect(result.current.isShowModal).toBe(false);
  });

  it('should reject file that is too large', () => {
    const { result } = renderHook(() => useImageUpload());
    const largeFile = createMockFile('large.jpg', 1024 * 1024 * 15, 'image/jpeg'); // 15MB
    const mockEvent = createMockEvent(largeFile);

    act(() => {
      result.current.handleImageFile(mockEvent);
    });

    expect(result.current.imageFile).toBeUndefined();
    expect(result.current.previewImage).toBe('');
    expect(result.current.error).toBe('File size limit 10MB.');
  });

  it('should handle multiple validation errors', () => {
    const { result } = renderHook(() => useImageUpload());
    const invalidFile = createMockFile('large.gif', 1024 * 1024 * 15, 'image/gif'); // 15MB GIF
    const mockEvent = createMockEvent(invalidFile);

    act(() => {
      result.current.handleImageFile(mockEvent);
    });

    expect(result.current.imageFile).toBeUndefined();
    expect(result.current.previewImage).toBe('');
    expect(result.current.error).toBe('Please upload .jpeg or .png files.  File size limit 10MB.');
  });

  it('should clear state when handleClearState is called', () => {
    const { result } = renderHook(() => useImageUpload());

    // First set some state
    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');

    act(() => {
      result.current.handleClearState();
    });

    expect(result.current.imageFile).toBe('');
    expect(result.current.error).toBe('');
  });

  it('should remove preview image when handleRemove is called', () => {
    const { result } = renderHook(() => useImageUpload());

    // First set a preview
    act(() => {
      result.current.handleSetPreviewImage('test-url');
    });

    expect(result.current.previewImage).toBe('test-url');

    act(() => {
      result.current.handleRemove();
    });

    expect(result.current.previewImage).toBe('');
  });

  it('should set preview image when handleSetPreviewImage is called with valid URL', () => {
    const { result } = renderHook(() => useImageUpload());

    act(() => {
      result.current.handleSetPreviewImage('new-preview-url');
    });

    expect(result.current.previewImage).toBe('new-preview-url');
  });

  it('should not set preview image when handleSetPreviewImage is called with empty URL', () => {
    const { result } = renderHook(() => useImageUpload());

    act(() => {
      result.current.handleSetPreviewImage('');
    });

    expect(result.current.previewImage).toBe('');
  });

  it('should toggle modal visibility when handleShowModal is called', () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.isShowModal).toBe(false);

    act(() => {
      result.current.handleShowModal();
    });

    expect(result.current.isShowModal).toBe(true);

    act(() => {
      result.current.handleShowModal();
    });

    expect(result.current.isShowModal).toBe(false);
  });

  it('should allow direct setting of modal state', () => {
    const { result } = renderHook(() => useImageUpload());

    act(() => {
      result.current.setShowModal(true);
    });

    expect(result.current.isShowModal).toBe(true);

    act(() => {
      result.current.setShowModal(false);
    });

    expect(result.current.isShowModal).toBe(false);
  });

  it('should allow direct setting of error', () => {
    const { result } = renderHook(() => useImageUpload());

    act(() => {
      result.current.setError('Custom error');
    });

    expect(result.current.error).toBe('Custom error');
  });

  it('should handle no file selected', () => {
    const { result } = renderHook(() => useImageUpload());
    const mockEvent = {
      target: {
        files: null,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleImageFile(mockEvent);
    });

    // Should not change state
    expect(result.current.imageFile).toBeUndefined();
    expect(result.current.previewImage).toBe('');
    expect(result.current.error).toBe('');
  });
});