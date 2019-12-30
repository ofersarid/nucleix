import React from 'react';
import Head from 'next/head';

const HtmlHeadTag = ({ title, description }) => (
  <Head >
    <meta charSet="utf-8" httpEquiv="Content-Type" content="Text/html" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <link rel="icon" href={`/images/favicon.ico?v=${new Date().getTime()}`} />
    <meta name="description" content={description || 'Lorem Ipsum'} />
    <meta
      name='viewport'
      content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
    />
    <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
    <title >{title || 'Nucleix'}</title >
  </Head >
);

export default HtmlHeadTag;
