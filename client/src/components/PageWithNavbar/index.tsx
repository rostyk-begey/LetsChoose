import React, { PropsWithChildren, useState } from 'react';
// @ts-ignore
import { Page as TablerPage, Grid, Form } from 'tabler-react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import Page from '../../components/Page';

enum SORT_OPTIONS {
  POPULAR = 'POPULAR',
  NEWEST = 'NEWEST',
}

interface Props {
  params: {
    sortBy: SORT_OPTIONS;
    search: string;
  };
  handleSearch: any;
  onInputChange: any;
}

const PageWithNavbar: React.FC<PropsWithChildren<Props>> = ({
  params,
  handleSearch,
  onInputChange,
  children,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useScrollPosition(
    ({ currPos }) => {
      const isShow = currPos.y < 0;
      if (isShow !== isScrolled) setIsScrolled(isShow);
    },
    [isScrolled],
  );

  return (
    <Page
      navbarBefore={
        <Grid.Col lg={5} className="ml-auto mt-4 mt-lg-0" ignoreCol>
          <div className="page-options d-flex">
            <Form.SelectGroup className="mr-2" canSelectMultiple={false}>
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Popular"
                value={SORT_OPTIONS.POPULAR}
                checked={params.sortBy === SORT_OPTIONS.POPULAR}
                onChange={onInputChange}
                name="sortBy"
              />
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Newest"
                value={SORT_OPTIONS.NEWEST}
                checked={params.sortBy === SORT_OPTIONS.NEWEST}
                onChange={onInputChange}
                name="sortBy"
              />
            </Form.SelectGroup>
            <div className="input-icon">
              <input
                name="search"
                className="form-control"
                type="text"
                placeholder="Search for..."
                defaultValue={params.search}
                onChange={handleSearch}
              />
              <span className="input-icon-addon">
                <i className="fe fe-search" />
              </span>
            </div>
          </div>
        </Grid.Col>
      }
    >
      <TablerPage.Content>{children}</TablerPage.Content>
    </Page>
  );
};

export default PageWithNavbar;
