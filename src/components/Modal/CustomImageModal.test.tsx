import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomImageModal } from './CustomImageModal';
import { resetGlobalLanguage, setGlobalLanguage } from '../../i18n/useTranslation';

const APPLIED_DATA_URL = 'data:image/png;base64,applied';
const CUSTOM_IMAGE_KEY = 'sliding_puzzle_custom_image';
const imageLoadControl = { shouldFail: false };

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 512;
  height = 512;
  crossOrigin = '';

  set src(_value: string) {
    const shouldFail = imageLoadControl.shouldFail;
    queueMicrotask(() => {
      if (shouldFail) {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    });
  }
}

const renderModal = () => {
  const onClose = vi.fn();
  const onApplyCustomImage = vi.fn();
  render(
    <CustomImageModal
      isOpen={true}
      onClose={onClose}
      onApplyCustomImage={onApplyCustomImage}
    />
  );
  return { onClose, onApplyCustomImage };
};

const getFileInput = () =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

const getDropzone = () =>
  document.querySelector('.upload-dropzone') as HTMLElement;

const uploadFile = async (file: File) => {
  fireEvent.change(getFileInput(), { target: { files: [file] } });
  return screen.findByText('퍼즐로 적용하기');
};

describe('CustomImageModal upload validation', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalLanguage();
    imageLoadControl.shouldFail = false;
    vi.stubGlobal('Image', MockImage);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(APPLIED_DATA_URL);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetGlobalLanguage();
  });

  it('rejects unsupported dropped file types with a localized message', () => {
    renderModal();

    fireEvent.drop(getDropzone(), {
      dataTransfer: { files: [new File(['text'], 'note.txt', { type: 'text/plain' })] },
    });

    expect(screen.getByRole('alert').textContent).toContain('지원하지 않는 이미지 형식');
  });

  it('rejects files larger than 10MB', () => {
    renderModal();
    const oversized = new File(['image'], 'huge.png', { type: 'image/png' });
    Object.defineProperty(oversized, 'size', {
      value: 10 * 1024 * 1024 + 1,
    });

    fireEvent.change(getFileInput(), { target: { files: [oversized] } });

    expect(screen.getByRole('alert').textContent).toContain('10MB');
  });

  it('renders validation errors in the current language', () => {
    setGlobalLanguage('en');
    renderModal();

    fireEvent.drop(getDropzone(), {
      dataTransfer: { files: [new File(['text'], 'note.txt', { type: 'text/plain' })] },
    });

    expect(screen.getByRole('alert').textContent).toContain('Unsupported image format');
  });

  it('highlights the dropzone while dragging a file over it', () => {
    renderModal();
    const dropzone = getDropzone();

    fireEvent.dragOver(dropzone, { dataTransfer: { files: [], dropEffect: '' } });
    expect(dropzone.className).toContain('drag-active');

    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('drag-active');
  });

  it('loads a dropped image, applies the crop, and persists it', async () => {
    const { onClose, onApplyCustomImage } = renderModal();

    fireEvent.drop(getDropzone(), {
      dataTransfer: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] },
    });

    const applyButton = await screen.findByText('퍼즐로 적용하기');
    await waitFor(() => {
      expect((applyButton.closest('button') as HTMLButtonElement).disabled).toBe(false);
    });
    fireEvent.click(applyButton);

    expect(localStorage.getItem('sliding_puzzle_custom_image')).toBe(APPLIED_DATA_URL);
    expect(onApplyCustomImage).toHaveBeenCalledWith(APPLIED_DATA_URL);
    expect(onClose).toHaveBeenCalled();
  });

  it('keeps the modal open and reports storage quota failures', async () => {
    const { onClose, onApplyCustomImage } = renderModal();
    const applyButton = await uploadFile(
      new File(['image'], 'photo.png', { type: 'image/png' })
    );
    await waitFor(() => {
      expect((applyButton.closest('button') as HTMLButtonElement).disabled).toBe(false);
    });

    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };
    vi.stubGlobal('localStorage', mockStorage);

    fireEvent.click(applyButton);

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'sliding_puzzle_custom_image',
      expect.any(String)
    );
    expect(screen.getByRole('alert').textContent).toContain('저장할 공간이 부족');
    expect(onApplyCustomImage).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('reopens with the storage state after the custom image is removed externally', async () => {
    const { rerender } = render(
      <CustomImageModal isOpen={true} onClose={vi.fn()} onApplyCustomImage={vi.fn()} />
    );

    await uploadFile(new File(['image'], 'photo.png', { type: 'image/png' }));
    expect(document.querySelector('.crop-canvas')).not.toBeNull();

    localStorage.removeItem(CUSTOM_IMAGE_KEY);
    rerender(
      <CustomImageModal isOpen={false} onClose={vi.fn()} onApplyCustomImage={vi.fn()} />
    );
    rerender(
      <CustomImageModal isOpen={true} onClose={vi.fn()} onApplyCustomImage={vi.fn()} />
    );

    expect(getDropzone()).not.toBeNull();
    expect(document.querySelector('.crop-canvas')).toBeNull();
    expect(screen.queryByText('퍼즐로 적용하기')).toBeNull();
  });

  it('keeps apply disabled and reports an error when a saved data URL fails to load', async () => {
    imageLoadControl.shouldFail = true;
    localStorage.setItem(CUSTOM_IMAGE_KEY, 'data:image/png;base64,broken');

    const { onApplyCustomImage } = renderModal();

    const applyButton = await screen.findByText('퍼즐로 적용하기');
    await waitFor(() => {
      expect((applyButton.closest('button') as HTMLButtonElement).disabled).toBe(true);
    });
    expect(screen.getByRole('alert').textContent).toContain('이미지를 불러오지 못했습니다');

    fireEvent.click(applyButton);

    expect(onApplyCustomImage).not.toHaveBeenCalled();
    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe('data:image/png;base64,broken');
  });
});
