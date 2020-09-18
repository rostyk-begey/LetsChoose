import React from 'react';
import cn from 'classnames';
import { Container, Grid, Nav } from 'tabler-react/dist';

import './index.scss';

const NavBar = ({
  items,
  itemsObjects,
  before,
  collapse = true,
  routerContextComponentType,
}) => {
  const baseClassName = 'nav-bar';
  const classes = cn('header d-lg-flex p-0', baseClassName, {
    [`${baseClassName}--collapse`]: collapse,
  });
  return (
    <div className={classes}>
      <Container>
        <Grid.Row className="align-items-center">
          {!!before && before}
          <Grid.Col className="col-lg order-lg-first">
            <Nav
              tabbed
              className="border-0 flex-column flex-lg-row"
              items={items}
              itemsObjects={itemsObjects}
              routerContextComponentType={routerContextComponentType}
            />
          </Grid.Col>
        </Grid.Row>
      </Container>
    </div>
  );
};

export default NavBar;
