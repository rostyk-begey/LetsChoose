import React from 'react';
// @ts-ignore
import { Page as TablerPage } from 'tabler-react';

import Page from '../../components/Page';

const IndexPage: React.FC = () => {
  const baseClassName = 'index-page';

  return (
    // @ts-ignore
    <Page className={baseClassName}>
      <TablerPage.Content title="Index page" />
    </Page>
  );
};

export default IndexPage;
