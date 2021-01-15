import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Grow from '@material-ui/core/Grow';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '../CustomButtons/Button';
import { getKeyValue } from '../../../utils/functions';

import styles from '../../../assets/jss/material-kit-react/components/customDropdownStyle';

interface Props {
  buttonText: string;
  buttonIcon?: any;
  dropdownList: any[];
  buttonProps?: any;
  dropup?: string;
  dropdownHeader?: string;
  caret?: boolean;
  hoverColor?: string;
  left?: string;
  rtlActive?: string;
  noLiPadding?: boolean;
  onClick?: (param: any) => any;
}

const useStyles = makeStyles(styles);

const nullElement: HTMLElement | null = null;

const CustomDropdown: React.FC<Props> = ({
  buttonText,
  buttonIcon: ButtonIcon,
  dropdownList,
  buttonProps,
  dropup,
  dropdownHeader,
  caret = true,
  hoverColor = 'primary',
  left,
  rtlActive,
  noLiPadding,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(nullElement);
  const handleClick = (event: any) => {
    if (anchorEl?.contains(event.target)) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (param: any) => {
    setAnchorEl(null);
    if (onClick) {
      onClick(param);
    }
  };

  const handleCloseAway = (event: any) => {
    if (anchorEl?.contains(event.target)) {
      return;
    }
    setAnchorEl(null);
  };

  const classes = useStyles();
  const caretClasses = classNames({
    [classes.caret]: true,
    [classes.caretActive]: Boolean(anchorEl),
    [classes.caretRTL]: rtlActive,
  });
  const dropdownItem = classNames({
    [classes.dropdownItem]: true,
    [getKeyValue(classes)(`${hoverColor}Hover` as keyof typeof classes)]: true,
    [classes.noLiPadding]: noLiPadding,
    [classes.dropdownItemRTL]: rtlActive,
  });

  let icon;
  switch (typeof ButtonIcon) {
    case 'object':
      icon = <ButtonIcon className={classes.buttonIcon} />;
      break;
    case 'string':
      icon = <Icon className={classes.buttonIcon}>{ButtonIcon}</Icon>;
      break;
    default:
      icon = null;
      break;
  }

  return (
    <div>
      <div>
        <Button
          aria-label="Notifications"
          aria-owns={anchorEl ? 'menu-list' : null}
          aria-haspopup="true"
          {...buttonProps}
          onClick={handleClick}
        >
          {icon}
          {buttonText !== undefined ? buttonText : null}
          {caret ? <b className={caretClasses} /> : null}
        </Button>
      </div>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        transition
        disablePortal
        placement={
          dropup
            ? left
              ? 'top-start'
              : 'top'
            : left
            ? 'bottom-start'
            : 'bottom'
        }
        className={classNames({
          [classes.popperClose]: !anchorEl,
          [classes.popperResponsive]: true,
        })}
      >
        {() => (
          <Grow
            in={Boolean(anchorEl)}
            //id="menu-list"
            style={
              dropup
                ? { transformOrigin: '0 100% 0' }
                : { transformOrigin: '0 0 0' }
            }
          >
            <Paper className={classes.dropdown}>
              <ClickAwayListener onClickAway={handleCloseAway}>
                <MenuList role="menu" className={classes.menuList}>
                  {dropdownHeader !== undefined ? (
                    <MenuItem
                      onClick={() => handleClose(dropdownHeader)}
                      className={classes.dropdownHeader}
                    >
                      {dropdownHeader}
                    </MenuItem>
                  ) : null}
                  {dropdownList.map((prop: any, key: any) => {
                    if (prop.divider) {
                      return (
                        <Divider
                          key={key}
                          onClick={() => handleClose('divider')}
                          className={classes.dropdownDividerItem}
                        />
                      );
                    }
                    return (
                      <MenuItem
                        key={key}
                        onClick={() => handleClose(prop)}
                        className={dropdownItem}
                      >
                        {prop}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default CustomDropdown;
