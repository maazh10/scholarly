import dotenv from "dotenv";
dotenv.config();
import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid", "profile", "email"],
  });
  const response = await fetch(process.env.BACKEND_URL + "/api/hello");
  // use getSession to get the user's id
  const session = getSession(req, res);
  console.log(session);
  const data = await response.json();
  console.log(accessToken);
  console.log(data);
  // decode the access token
  const decodedAccessToken = jwt.decode(accessToken, { complete: true });
  // call the auth0 /userinfo endpoint to get the user's profile
  const userinfo = await fetch(
    process.env.AUTH0_ISSUER_BASE_URL + "/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  res.json({ data, accessToken, userinfo, decodedAccessToken, session });
}
