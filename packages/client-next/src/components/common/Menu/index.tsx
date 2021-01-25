import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import Box from '@material-ui/core/Box';
import { useFloatNavigationMenuStyles } from '@mui-treasury/styles/navigationMenu/float';
import { NavMenu, NavItem } from '@mui-treasury/components/menu/navigation';

export interface MenuLink {
  href: string;
  active: boolean;
  label: string;
  icon?: ReactNode;
}

interface Props {
  links: MenuLink[];
}

const NavLink: React.FC<{ active: boolean } & LinkProps> = ({
  active,
  children,
  ...props
}) => {
  return (
    <Link {...props}>
      <NavItem as="a" active={active}>
        {children}
      </NavItem>
    </Link>
  );
};

const Menu: React.FC<Props> = ({ links }) => (
  <Box height={40} display="flex" marginRight="auto">
    <NavMenu useStyles={useFloatNavigationMenuStyles}>
      {links.map(({ href, active, label, icon }) => (
        <NavLink key={href} href={href} active={active}>
          <Box display="inline-flex" mr={2}>
            {icon}
          </Box>
          {label}
        </NavLink>
      ))}
    </NavMenu>
  </Box>
);

export default Menu;
