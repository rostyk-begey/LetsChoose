import React from 'react';
import { Page as TablerPage } from 'tabler-react';

import Page from 'app/components/Page';

const IndexPage = () => {
  const baseClassName = 'index-page';

  return (
    <Page className={baseClassName}>
      <TablerPage.Content title="Index page" />
    </Page>
  );
};

export default IndexPage;
