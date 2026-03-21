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
    const mimeType = blob.type || 'image/jpeg';
    const finalMimeType =
      mimeType === 'application/octet-stream' || !blob.type ? 'image/jpeg' : mimeType;
    if (!SUPPORTED_FORMATS.includes(finalMimeType)) {
      return undefined;
    }
    const fileExtension = finalMimeType.split('/')[1] || 'jpg';
    const fileNameWithExtension = `${fileName}.${fileExtension}`;

    const file = new File([blob], fileNameWithExtension, { type: finalMimeType });
    return file;
  } catch (error) {
    console.error('Error converting URL to file:', error);
    return undefined;
  }
};

export async function urlToDataUrl(url: string): Promise<string> {
  const trimmed = url.trim();
  if (!trimmed) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
  if (trimmed.startsWith('data:')) return trimmed;

  try {
    const resp = await fetch(trimmed);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let blob = await resp.blob();
    if (blob.type === 'application/octet-stream' || !blob.type) {
      blob = new Blob([blob], { type: 'image/jpeg' });
    }
    const base64 = await blobToBase64(blob);
    return base64 as string;
  } catch (error) {
    console.error('Error fetching image for DataUrl:', error);
    // Return a dummy transparent pixel base64 to avoid backend crashing on missing comma
    // or return the original url and hope backend doesn't crash (it will).
    // The dummy will satisfy the backend.
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}
export const getFileToUrl = (coverPhoto: File | string | null | undefined) => {
  if (coverPhoto instanceof File) return URL.createObjectURL(coverPhoto);
  return coverPhoto || '';
};

export const options = (options: string[] | null | undefined) => {
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

export function isUserProfile(userId: string | number, id: string | number) {
  if (String(userId) === String(id)) {
    return true;
  }
}

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}
