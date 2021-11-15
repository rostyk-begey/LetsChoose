import React, { ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  Root,
  Header as MuiHeader,
  Content as MuiContent,
  Footer as MuiFooter,
  EdgeSidebar as MuiEdgeSidebar,
  SidebarContent as MuiSidebarContent,
  EdgeTrigger as MuiEdgeTrigger,
  getCozyScheme,
  ContextValue,
} from '@mui-treasury/layout';
import { OneTapContainer } from '../OneTapContainer';

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_XS,
  PRIMARY_SUBHEADER_HEIGHT,
  SUBHEADER_LAYER,
} from './constants';
import { Footer } from '../Footer';

export interface LayoutProps {
  className?: string;
  title?: ReactNode;
  subHeader?: ReactNode;
  primarySidebar?: (
    sidebarState: ContextValue['state']['leftEdgeSidebar'],
  ) => ReactNode;
  toolbarContent?: ReactNode;
  isLoading?: boolean;
}

const cozyScheme = getCozyScheme();

const SubheaderContainer = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: HEADER_HEIGHT,
  zIndex: SUBHEADER_LAYER,
  [theme.breakpoints.down('sm')]: {
    top: HEADER_HEIGHT_XS,
  },
}));

export const Layout: React.FC<LayoutProps> = ({
  title,
  subHeader,
  toolbarContent,
  children,
  primarySidebar,
  className,
  isLoading,
}) => (
  <Root
    scheme={{
      ...cozyScheme,
      subheader: {
        config: {
          sm: {
            position: 'relative',
            height: PRIMARY_SUBHEADER_HEIGHT,
          },
          xs: {
            position: 'relative',
            height: PRIMARY_SUBHEADER_HEIGHT,
          },
        },
      },
      leftEdgeSidebar: {
        hidden: !primarySidebar,
        config: {
          md: {
            variant: 'permanent',
            collapsedWidth: 65,
            width: 256,
            collapsible: true,
          },
          xs: {
            variant: 'temporary',
            width: 256,
          },
        },
      },
    }}
  >
    {({ state: { leftEdgeSidebar } }) => (
      <>
        <Backdrop
          open={!!isLoading}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 100,
            color: 'common.white',
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <MuiHeader
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            justifyContent: 'center',
          }}
        >
          <Toolbar>
            <MuiEdgeTrigger target={{ anchor: 'left', field: 'open' }}>
              {(open, setOpen) => (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => setOpen(true)}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <MenuRoundedIcon />
                </IconButton>
              )}
            </MuiEdgeTrigger>
            <Box display="flex">{title}</Box>
            {toolbarContent}
          </Toolbar>
        </MuiHeader>
        <SubheaderContainer>{subHeader}</SubheaderContainer>
        {!!primarySidebar && (
          <MuiEdgeSidebar anchor="left">
            <MuiSidebarContent
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              {primarySidebar(leftEdgeSidebar)}
            </MuiSidebarContent>
            <MuiEdgeTrigger target={{ anchor: 'left', field: 'collapsed' }}>
              {(collapsed, setCollapsed) => (
                <Button
                  aria-label={`${collapsed ? 'expand' : 'collapse'} drawer`}
                  sx={{
                    width: '100%',
                    height: 52,
                    borderRadius: 0,
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                  onClick={() => setCollapsed(!collapsed)}
                >
                  {collapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </Button>
              )}
            </MuiEdgeTrigger>
          </MuiEdgeSidebar>
        )}
        <MuiContent
          sx={{
            flex: 1,
            backgroundColor: 'background.default',
            position: 'relative',
            py: 3,
            px: 0,
          }}
          className={className}
        >
          <OneTapContainer />
          {children}
        </MuiContent>
        <MuiFooter
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            borderTop: (theme) =>
              `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
            backgroundColor: 'background.default',
          }}
        >
          <Footer />
        </MuiFooter>
      </>
    )}
  </Root>
);
