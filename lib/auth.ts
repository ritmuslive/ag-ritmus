import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { magicLink, organization, admin, username } from "better-auth/plugins";
import { Resend } from "resend";
import {
  VerificationMail,
  TeamInviteEmail,
} from "@/components/email-templates";
import { syncUserWithDodoPayments } from "./dodopayments";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  appName: "Ritmus",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: [process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Sync user with DodoPayments after creation
          // This will look up or create a customer and store the customerId
          await syncUserWithDodoPayments(user.id, user.email, user.name);
        },
      },
    },
  },
  user: {
    modelName: "user",
    deleteUser: {
      enabled: true,
      // sendDeleteAccountVerification callback removed to allow direct deletion
      beforeDelete: async (_user: { id: string }) => {
        // Perform actions before user deletion
      },
      afterDelete: async (_user: { id: string }) => {
        // Perform cleanup after user deletion
      },
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      subscribe: {
        type: "boolean",
        defaultValue: false,
      },
      subscriptionId: {
        type: "string",
        required: false,
        defaultValue: "starter",
      },
      customerId: {
        type: "string",
        required: false,
      },
      basicCredit: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      proCredit: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      premiumCredit: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, ctx) => {
        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: email,
          subject: "Your activation link for Ritmus",
          react: VerificationMail({ magicLink: url, email: email }),
        });
      },
    }),
    admin(),
    organization({
      requireEmailVerificationOnInvitation: true,
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/auth/invitation/${data.id}`;
        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: data.email,
          subject:
            data.inviter.user.name +
            " has invited you to collaborate in Ritmus",
          react: TeamInviteEmail({
            invitedByUsername: data.inviter.user.name,
            teamName: data.organization.name,
            inviteLink,
          }),
        });
      },
      schema: {
        organization: {
          additionalFields: {
            subscriptionId: {
              type: "string",
              required: false,
              defaultValue: "starter",
            },
            basicCredit: {
              type: "number",
              required: false,
              defaultValue: 0,
            },
            proCredit: {
              type: "number",
              required: false,
              defaultValue: 0,
            },
            premiumCredit: {
              type: "number",
              required: false,
              defaultValue: 0,
            },
          },
        },
      },
    }),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 32,
      usernameValidator: (username) => {
        if (username === "admin") {
          return false;
        }
        return true;
      },
      displayUsernameValidator: (displayUsername) => {
        // Allow only alphanumeric characters, underscores, and hyphens
        return /^[a-zA-Z0-9_-]+$/.test(displayUsername);
      },
    }),
    nextCookies(), // Next.js server actions için cookie desteği
  ],
});
