import React, { ReactNode, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import {
  Root,
  getHeader,
  getContent,
  getDrawerSidebar,
  getSidebarContent,
  getFooter,
  getSidebarTrigger,
  getCollapseBtn,
  getCozyScheme,
} from '@mui-treasury/layout';
import { SidebarState } from '@mui-treasury/layout/types';

import theme from '../../../theme';

interface Props {
  className?: string;
  title?: ReactNode;
  subHeader?: ReactNode;
  primarySidebar?: (state: SidebarState) => ReactNode;
  footer?: ReactNode;
  toolbarContent?: ReactNode;
}

const MuiHeader = getHeader(styled);
const MuiContent = getContent(styled);
const MuiDrawerSidebar = getDrawerSidebar(styled);
const MuiSidebarContent = getSidebarContent(styled);
const MuiFooter = getFooter(styled);
const MuiSidebarTrigger = getSidebarTrigger(styled);
const MuiCollapseBtn = getCollapseBtn(styled);

const cozyScheme = getCozyScheme();

cozyScheme.configureEdgeSidebar((builder) => {
  builder
    .create('primarySidebar', { anchor: 'left' })
    .registerPermanentConfig('md', {
      collapsedWidth: 65,
      width: 256,
      collapsible: true,
    });
});

cozyScheme.configureSubheader((builder) => {
  builder
    .create('profileHeader', {})
    .registerConfig('sm', {
      position: 'sticky',
      top: 64,
      initialHeight: 81,
    })
    .registerConfig('xs', {
      position: 'sticky',
      top: 56,
      initialHeight: 81,
    });
});

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'sticky',
    bottom: 0,
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.background.default,
  },
}));

const Layout: React.FC<Props> = ({
  title,
  subHeader,
  footer,
  toolbarContent,
  children,
  primarySidebar,
  className,
}) => {
  const classes = useStyles();
  useEffect(() => {
    cozyScheme.configureEdgeSidebar((builder) => {
      builder.hide('primarySidebar', !primarySidebar);
    });
  }, [primarySidebar]);

  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <Root theme={theme} scheme={cozyScheme}>
        {({ state: { sidebar } }) => (
          <>
            <MuiHeader>
              <Toolbar>
                <MuiSidebarTrigger sidebarId="primarySidebar" />
                <Button className="">{title}</Button>
                {toolbarContent}
              </Toolbar>
            </MuiHeader>
            {subHeader}
            <MuiDrawerSidebar
              sidebarId="primarySidebar"
              open={!!primarySidebar}
            >
              <MuiSidebarContent>
                {!!primarySidebar && primarySidebar(sidebar.primarySidebar)}
              </MuiSidebarContent>
              <MuiCollapseBtn />
            </MuiDrawerSidebar>
            <MuiContent className={className}>
              {/*<ContentMockUp />*/}
              {children}
            </MuiContent>
            <MuiFooter className={classes.footer}>{footer}</MuiFooter>
          </>
        )}
      </Root>
    </StylesProvider>
  );
};

export default Layout;
