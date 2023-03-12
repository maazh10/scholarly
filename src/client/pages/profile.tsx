import React from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import Loading from "../components/Loading";
import Error from "../components/Error";

const Profile = () => {
  const { user, isLoading } = useUser();

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <div data-testid="profile">
            <div>
              <img
                src={user.picture}
                alt="Profile"
                data-testid="profile-picture"
              />
            </div>
            <div>
              <h2>{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </div>
          </div>
          <div>{JSON.stringify(user, null, 2)}</div>
        </>
      )}
    </>
  );
};

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: (error) => <Error error={error} />,
});
