import React from "react";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";

import "../styles/globals.scss";
import "../styles/call-page.scss";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
