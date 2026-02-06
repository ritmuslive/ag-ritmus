import "dotenv/config";
import {
  organizationClient,
  usernameClient,
  magicLinkClient,
  inferOrgAdditionalFields,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    magicLinkClient(),
    usernameClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});

// authClient içinden gerekli methodları çıkar
export const { signIn, signUp, signOut, useSession } = authClient;
