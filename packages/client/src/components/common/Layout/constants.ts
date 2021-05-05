import { HeaderConfig } from '@mui-treasury/layout/types';

export const PRIMARY_SIDEBAR_ID = 'primarySidebar';

export const HEADER_HEIGHT = 64;
export const HEADER_HEIGHT_XS = 56;
export const PRIMARY_SUBHEADER_HEIGHT = 54;
export const SECONDARY_SUBHEADER_HEIGHT = 80;

export const PRIMARY_SUBHEADER_ID = 'PRIMARY_SUBHEADER';

export const SECONDARY_SUBHEADER_ID = 'SECONDARY_SUBHEADER';

export type SubheaderId =
  | typeof PRIMARY_SUBHEADER_ID
  | typeof SECONDARY_SUBHEADER_ID;

export type SubheaderBreakpoint = 'sm' | 'xs';

export type SubheaderConfig = Record<
  SubheaderId,
  Record<SubheaderBreakpoint, HeaderConfig>
>;

const layer = 10;

export const SUBHEADER_CONFIG: SubheaderConfig = {
  [PRIMARY_SUBHEADER_ID]: {
    sm: {
      position: 'fixed',
      top: HEADER_HEIGHT,
      initialHeight: PRIMARY_SUBHEADER_HEIGHT,
      layer,
    },
    xs: {
      position: 'fixed',
      top: HEADER_HEIGHT_XS,
      initialHeight: PRIMARY_SUBHEADER_HEIGHT,
      layer,
    },
  },
  [SECONDARY_SUBHEADER_ID]: {
    sm: {
      position: 'relative',
      initialHeight: PRIMARY_SUBHEADER_HEIGHT,
    },
    xs: {
      position: 'relative',
      initialHeight: PRIMARY_SUBHEADER_HEIGHT,
    },
  },
};
