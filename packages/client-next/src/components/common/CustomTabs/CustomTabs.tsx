import Tab from '@material-ui/core/Tab';
import React, { ReactNode, useState } from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import classNames from 'classnames';

import CustomCard from '../Card/Card';
import CardBody from '../Card/CardBody';
import CardHeader from '../Card/CardHeader';

import styles from '../../../assets/jss/material-kit-react/components/customTabsStyle';

const useStyles = makeStyles(styles);

export interface TabProps {
  icon?: string | React.FC;
  content: ReactNode;
  name: string;
}

interface Props {
  headerColor?: 'warning' | 'success' | 'danger' | 'info' | 'primary';
  plainTabs: boolean;
  tabs: TabProps[];
  title: string;
  rtlActive: string;
}

const CustomTabs: React.FC<Props> = ({
  headerColor,
  plainTabs,
  tabs,
  title,
  rtlActive,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<any>, value: number) => {
    setValue(value);
  };
  const classes = useStyles();
  const cardTitle = classNames(classes.cardTitle, {
    [classes.cardTitleRTL]: rtlActive,
  });

  return (
    <CustomCard plain={plainTabs}>
      <CardHeader color={headerColor} plain={plainTabs}>
        {title && <div className={cardTitle}>{title}</div>}
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.tabsRoot,
            indicator: classes.displayNone,
          }}
        >
          {tabs.map(({ name, icon: TabIcon }: TabProps, i: number) => {
            let icon = {};
            if (TabIcon) {
              icon = {
                icon:
                  typeof TabIcon === 'string' ? (
                    <Icon>{TabIcon}</Icon>
                  ) : (
                    <TabIcon />
                  ),
              };
            }
            return (
              <Tab
                classes={{
                  root: classes.tabRootButton,
                  //label: classes.tabLabel,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper,
                }}
                key={i}
                label={name}
                {...icon}
              />
            );
          })}
        </Tabs>
      </CardHeader>
      <CardBody>
        {tabs.map(({ content }, index) => {
          if (index === value) {
            return <div key={index}>{content}</div>;
          }
          return null;
        })}
      </CardBody>
    </CustomCard>
  );
};

export default CustomTabs;
