import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";

import "../styles/globals.scss";
import "../styles/call-page.scss"
import "../styles/navbar.scss";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
};

export default App;
