/* eslint-disable @typescript-eslint/ban-types */
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
  return secureUrl.split('image/upload').pop() as string;
};
