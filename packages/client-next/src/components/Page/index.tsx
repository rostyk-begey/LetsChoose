import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface Props {}

const Page: React.FC<Props> = ({ children }) => {
  const baseClassName = '';

  return (
    <>
      <Header brand="Let's Choose" />
      <div className={baseClassName}>{children}</div>
      <Footer />
    </>
  );
};

export default Page;
