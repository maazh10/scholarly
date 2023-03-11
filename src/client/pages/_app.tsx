import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";

import Layout from "../components/Layout";

import "../styles/globals.scss";
import "../styles/navbar.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
