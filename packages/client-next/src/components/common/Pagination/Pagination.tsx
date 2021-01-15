import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { getKeyValue } from '../../../utils/functions';

import styles from '../../../assets/jss/material-kit-react/components/paginationStyle';

interface Props {
  pages: Array<{
    text: string;
    active: boolean;
    disabled: boolean;
    onClick: () => any;
  }>;
  color?:
    | 'pagination'
    | 'disabled'
    | 'paginationItem'
    | 'paginationLink'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger';
}

const useStyles = makeStyles(styles);

const Pagination: React.FC<Props> = ({ pages, color = 'primary' }) => {
  const classes = useStyles();

  return (
    <ul className={classes.pagination}>
      {pages.map(({ active, disabled, onClick, text }: any, key: any) => {
        const paginationLink = classNames({
          [classes.paginationLink]: true,
          [getKeyValue(classes)(color)]: active,
          [classes.disabled]: disabled,
        });

        return (
          <li className={classes.paginationItem} key={key}>
            {onClick ? (
              <Button onClick={onClick} className={paginationLink}>
                {text}
              </Button>
            ) : (
              <Button
                onClick={() => alert("you've clicked " + text)}
                className={paginationLink}
              >
                {text}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
