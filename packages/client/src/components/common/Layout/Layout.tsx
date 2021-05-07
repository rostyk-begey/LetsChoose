import React, { ReactNode, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
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
import classNames from 'classnames';
import styled from 'styled-components';

import {
  PRIMARY_SIDEBAR_ID,
  PRIMARY_SUBHEADER_ID,
  SECONDARY_SUBHEADER_ID,
  SUBHEADER_CONFIG,
} from './constants';
import Footer from '../Footer';

interface Props {
  className?: string;
  title?: ReactNode;
  subHeader?: ReactNode;
  primarySidebar?: (state: SidebarState) => ReactNode;
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
    .create(PRIMARY_SIDEBAR_ID, { anchor: 'left' })
    .registerPermanentConfig('md', {
      collapsedWidth: 65,
      width: 256,
      collapsible: true,
    })
    .registerTemporaryConfig('sm', {
      width: 256,
    });
});

cozyScheme.configureSubheader((builder) => {
  builder
    .create(PRIMARY_SUBHEADER_ID, {})
    .registerConfig('sm', SUBHEADER_CONFIG[PRIMARY_SUBHEADER_ID].sm)
    .registerConfig('xs', SUBHEADER_CONFIG[PRIMARY_SUBHEADER_ID].xs);
});

cozyScheme.configureSubheader((builder) => {
  builder
    .create(SECONDARY_SUBHEADER_ID, {})
    .registerConfig('sm', SUBHEADER_CONFIG[SECONDARY_SUBHEADER_ID].sm)
    .registerConfig('xs', SUBHEADER_CONFIG[SECONDARY_SUBHEADER_ID].xs);
});

const useStyles = makeStyles((theme) => ({
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'center',
  },
  logoBtn: {
    padding: 0,
  },
  footer: {
    position: 'sticky',
    bottom: 0,
    zIndex: theme.zIndex.appBar,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.background.default,
  },
  content: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Layout: React.FC<Props> = ({
  title,
  subHeader,
  toolbarContent,
  children,
  primarySidebar,
  className,
}) => {
  const classes = useStyles();
  cozyScheme.configureEdgeSidebar((builder) => {
    builder.hide('primarySidebar', !primarySidebar);
  });

  return (
    <Root themeProviderOmitted scheme={cozyScheme}>
      {({ state: { sidebar } }) => (
        <>
          <MuiHeader className={classes.header}>
            <Toolbar>
              <MuiSidebarTrigger sidebarId={PRIMARY_SIDEBAR_ID} />
              <Button className={classes.logoBtn}>{title}</Button>
              {toolbarContent}
            </Toolbar>
          </MuiHeader>
          {subHeader}
          {primarySidebar && (
            <MuiDrawerSidebar sidebarId="primarySidebar" open>
              <MuiSidebarContent className={classes.sidebarContent}>
                {primarySidebar(sidebar.primarySidebar)}
              </MuiSidebarContent>
              <MuiCollapseBtn />
            </MuiDrawerSidebar>
          )}
          <MuiContent className={classNames(classes.content, className)}>
            {children}
          </MuiContent>
          <MuiFooter className={classes.footer}>
            <Footer />
          </MuiFooter>
        </>
      )}
    </Root>
  );
};

export default Layout;
