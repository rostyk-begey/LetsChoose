// eslint-disable-next-line @typescript-eslint/ban-types
export const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (
  key: U,
) => obj[key];

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const imageSize = (width, multiplier = 3 / 4) => ({
  width: width,
  height: width * multiplier,
});
