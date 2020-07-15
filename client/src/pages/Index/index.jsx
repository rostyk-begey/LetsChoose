import React from 'react';
import Page from 'app/components/Page';

const IndexPage = () => {
  const baseClassName = 'index-page';

  return (
    <Page className={baseClassName}>
      <h1 className={`${baseClassName}_title`}>Index page</h1>
    </Page>
  );
};

export default IndexPage;
