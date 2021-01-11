import React, { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Snack from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import classNames from 'classnames';

import { getKeyValue } from '../../utils/functions';

import styles from '../../assets/jss/material-kit-react/components/snackbarContentStyle';

const useStyles = makeStyles(styles);

const nullJSXElement: any = null;

interface Props {
  message: string;
  color:
    | 'root'
    | 'icon'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'message'
    | 'close'
    | 'iconButton'
    | 'container';
  close: string;
  icon: React.ReactElement | string | null;
}

const SnackbarContent: React.FC<Props> = ({
  message,
  color,
  close,
  icon: SnackIcon,
}) => {
  const classes = useStyles();
  let action: any = [];
  const closeAlert = () => {
    setAlert(nullJSXElement);
  };
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={closeAlert}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  let snackIcon = null;
  switch (typeof SnackIcon) {
    case 'object':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      snackIcon = <SnackIcon className={classes.icon} />;
      break;
    case 'string':
      snackIcon = <Icon className={classes.icon}>{SnackIcon}</Icon>;
      break;
    default:
      snackIcon = null;
      break;
  }
  const [alert, setAlert] = useState(
    <Snack
      message={
        <div>
          {snackIcon}
          {message}
          {close !== undefined ? action : null}
        </div>
      }
      classes={{
        root: classNames(classes.root, getKeyValue(classes)(color)),
        message: classNames(classes.message, classes.container),
      }}
    />,
  );
  return alert;
};

export default SnackbarContent;
