/*
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import classNames from 'classnames';
// import SwipeableViews from 'react-swipeable-views';

import styles from '../../../assets/jss/material-kit-react/components/navPillsStyle';
import GridContainer from '../Grid/GridContainer';
import GridItem from '../Grid/GridItem';
import { getKeyValue } from '../../../utils/functions';

const useStyles = makeStyles(styles);

interface Props {
  active: number;
  tabs: any[];
  direction: string;
  color: string;
  horizontal: any;
  alignCenter?: boolean;
}

const NavPills: React.FC<Props> = ({
  active = 0,
  tabs,
  direction,
  color = 'primary',
  horizontal,
  alignCenter,
}) => {
  const [activeTab, setActiveTab] = useState(active);
  const handleChange = (event: any, active: any) => {
    setActiveTab(active);
  };
  const handleChangeIndex = (index: any) => {
    setActiveTab(index);
  };
  const classes = useStyles();
  const flexContainerClasses = classNames({
    [classes.flexContainer]: true,
    [classes.horizontalDisplay]: horizontal !== undefined,
  });
  const tabButtons = (
    <Tabs
      classes={{
        root: classes.root,
        fixed: classes.fixed,
        flexContainer: flexContainerClasses,
        indicator: classes.displayNone,
      }}
      value={activeTab}
      onChange={handleChange}
      centered={alignCenter}
    >
      {tabs.map((prop: any, key: any) => {
        const icon: { [k: string]: any } = {};
        if (prop.tabIcon !== undefined) {
          icon.icon = <prop.tabIcon className={classes.tabIcon} />;
        }
        const pillsClasses = classNames({
          [classes.pills]: true,
          [classes.horizontalPills]: horizontal !== undefined,
          [classes.pillsWithIcons]: prop.tabIcon !== undefined,
        });
        return (
          <Tab
            label={prop.tabButton}
            key={key}
            {...icon}
            classes={{
              root: pillsClasses,
              selected: getKeyValue(classes)(color as any),
              wrapper: classes.tabWrapper,
            }}
          />
        );
      })}
    </Tabs>
  );
  const tabContent = (
    <div className={classes.contentWrapper}>
      <SwipeableViews
        axis={direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeTab}
        onChangeIndex={handleChangeIndex}
      >
        {tabs.map((prop: any, key: any) => {
          return (
            // <div className={classes.tabContent} key={key}>
            <div key={key}>{prop.tabContent}</div>
          );
        })}
      </SwipeableViews>
    </div>
  );
  return horizontal !== undefined ? (
    <GridContainer>
      <GridItem {...horizontal.tabsGrid}>{tabButtons}</GridItem>
      <GridItem {...horizontal.contentGrid}>{tabContent}</GridItem>
    </GridContainer>
  ) : (
    <div>
      {tabButtons}
      {tabContent}
    </div>
  );
};

export default NavPills;
*/

export {};
