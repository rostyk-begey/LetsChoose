import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import styles from '../../assets/jss/material-kit-react/components/parallaxStyle';

const useStyles = makeStyles(styles);

interface Props {
  filter?: boolean;
  image: string;
  className?: string;
  style?: any;
  small?: boolean;
}

const Parallax: React.FC<Props> = ({
  filter,
  children,
  image,
  small,
  style = {},
  className = '',
}) => {
  const [translateY, setTranslateY] = useState(0);
  useEffect(() => {
    window?.addEventListener('scroll', resetTransform);
    return () => window?.removeEventListener('scroll', resetTransform);
  });
  const resetTransform = () => {
    if (window?.innerWidth >= 768) {
      setTranslateY(window.pageYOffset / 3);
    }
  };
  const classes = useStyles();
  const parallaxClasses = classNames({
    [classes.parallax]: true,
    [classes.filter]: filter,
    [classes.small]: small,
    [className]: className !== undefined,
  });
  return (
    <div
      className={parallaxClasses}
      style={{
        ...style,
        backgroundImage: `url(${image})`,
        transform: `translate3d(0, ${translateY}px, 0)`,
      }}
    >
      {children}
    </div>
  );
};

export default Parallax;
