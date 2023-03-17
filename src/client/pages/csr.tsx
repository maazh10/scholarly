import React from "react";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0/client";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const CSRPage: React.FC = () => {
  const { user, isLoading } = useUser();

  return (
    <>
      <div className="mb-5" data-testid="csr">
        <h1 data-testid="csr-title">Client-side Rendered Page</h1>
        <div data-testid="csr-text">
          <p>
            You can protect a client-side rendered page by wrapping it with{" "}
            <code>withPageAuthRequired</code>. Only logged in users will be able
            to access it. If the user is logged out, they will be redirected to
            the login page instead.
          </p>
          <p>
            Use the <code>useUser</code> hook to access the user profile from
            protected client-side rendered pages. The <code>useUser</code> hook
            relies on the <code>UserProvider</code> Context Provider, so you
            need to wrap your custom{" "}
            <a href="https://nextjs.org/docs/advanced-features/custom-app">
              App Component
            </a>{" "}
            with it.
          </p>
          <p>
            You can also fetch the user profile by calling the{" "}
            <code>/api/auth/me</code> API route.
          </p>
          <p>{JSON.stringify(user, null, 2)}</p>
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(CSRPage, {
  onRedirecting: () => <Loading />,
  onError: (error) => <Error error={error} />,
});
