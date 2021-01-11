import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { getKeyValue } from '../../utils/functions';

import styles from '../../assets/jss/material-kit-react/components/infoStyle';

const useStyles = makeStyles(styles);

interface Props {
  title: string;
  description: string;
  iconColor:
    | 'infoArea'
    | 'gray'
    | 'icon'
    | 'iconWrapper'
    | 'primary'
    | 'warning'
    | 'danger'
    | 'success'
    | 'info'
    | 'rose'
    | 'descriptionWrapper'
    | 'title'
    | 'description'
    | 'iconWrapperVertical'
    | 'iconVertical';
  vertical?: boolean;
  icon: React.FC<{ className: string }>;
}

const InfoArea: React.FC<Props> = ({
  title,
  description,
  iconColor = 'gray',
  vertical,
  icon: Icon,
}) => {
  const classes = useStyles();
  const iconWrapper = classNames({
    [classes.iconWrapper]: true,
    [getKeyValue(classes)(iconColor)]: true,
    [classes.iconWrapperVertical]: vertical,
  });
  const iconClasses = classNames({
    [classes.icon]: true,
    [classes.iconVertical]: vertical,
  });
  return (
    <div className={classes.infoArea}>
      <div className={iconWrapper}>
        <Icon className={iconClasses} />
      </div>
      <div className={classes.descriptionWrapper}>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.description}>{description}</p>
      </div>
    </div>
  );
};

export default InfoArea;
