import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useImageUpload() {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | undefined | string>(undefined);
  const [error, setError] = useState<string>('');
  const [isShowModal, setShowModal] = useState<boolean>(false);
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxsize = 1024 * 1024 * 10;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowModal(false);
    const file = e.target.files?.[0];
    if (!file) return;

    // File & Size Error
    const errorsOfFile: string[] = [];
    // checking file type & file size
    if (!allowedTypes.includes(file.type)) {
      errorsOfFile.push(t('upload.invalidType', 'Please upload .jpeg or .png files. '));
    }
    // checking file size
    if (file.size > maxsize) {
      errorsOfFile.push(
        t('upload.sizeLimit', 'File size limit {{size}}MB.', {
          size: maxsize / (1024 * 1024),
        }),
      );
    }
    if (errorsOfFile.length > 0) {
      setError(errorsOfFile.join(' '));
      return;
    }
    setError('');

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setImageFile(file);
  };

  const handleClearState = () => {
    setImageFile('');
    setError('');
  };

  const handleRemove = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage('');
  };

  const handleSetPreviewImage = (url: string) => {
    if (!url) return;
    setPreviewImage(url);
  };

  const handleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  return {
    imageFile,
    previewImage,
    error,
    handleImageFile,
    handleClearState,
    handleRemove,
    handleSetPreviewImage,
    isShowModal,
    setShowModal,
    handleShowModal,
    setError,
  };
}
