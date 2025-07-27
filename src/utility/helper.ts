import { SUPPORTED_FORMATS } from './constant';

export const goToTop = (top = 0) => {
  window.scrollTo({
    top,
  });
};

export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const convertedURLToFile = async (url: string): Promise<File | undefined> => {
  if (!url) return;

  const fileName = url.split('/').pop()?.split('?')[0] || 'image';

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType = blob.type;
    const fileExtension = mimeType.split('/')[1];
    const fileNameWithExtension = `${fileName}.${fileExtension}`;

    if (!SUPPORTED_FORMATS.includes(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    const file = new File([blob], fileNameWithExtension, { type: mimeType });
    return file;
  } catch (error) {
    console.error('Error converting URL to file:', error);
    return undefined;
  }
};

export async function urlToDataUrl(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const blob = await resp.blob();
  const base64 = await blobToBase64(blob);
  return base64 as string;
}
export const getFileToUrl = (coverPhoto: File | string) => {
  if (coverPhoto instanceof File) return URL.createObjectURL(coverPhoto);
  return coverPhoto || '';
};

export const options = (options: string[]) => {
  if (options && options?.length > 0) {
    const option = options?.map((item: string) => {
      return { label: item, value: item };
    });
    return option;
  }
};

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isUserProfile(userId: string, id: string) {
  if (String(userId) === String(id)) {
    return true;
  }
}
