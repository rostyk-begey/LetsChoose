/* eslint-disable @typescript-eslint/ban-types */
import { TransformerOption } from '@cld-apis/types/lib/options/TransformerOption';
import buildUrl, { setConfig } from 'cloudinary-build-url';

export const getKeyValue =
  <T extends object, U extends keyof T>(obj: T) =>
  (key: U) =>
    obj[key];
/* eslint-enable @typescript-eslint/ban-types */

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const imageSize = (width: number, multiplier = 3 / 4) => ({
  width: width,
  height: width * multiplier,
});

export const cloudinaryUploadPath = (secureUrl: string): string => {
  return secureUrl.split('image/upload/').pop() as string;
};

setConfig({
  cloudName: 'dcfzgnkj8',
});

export const buildCloudinaryUrl = (
  url: string,
  transformations?: TransformerOption,
) =>
  buildUrl(cloudinaryUploadPath(url), {
    transformations,
  });

export const cloudinaryAspectRatio = (url: string, aspectRatio = '4:3') =>
  buildCloudinaryUrl(url, {
    resize: {
      type: 'fill',
      aspectRatio,
    },
  });

export const cloudinaryBlurPreview = (url: string) =>
  buildCloudinaryUrl(url, {
    effect: {
      name: 'pixelate',
      value: 40,
    },
  });
