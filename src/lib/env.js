import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  runtimeEnv: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    CLERK_USER_PROFILE_URL: process.env.NEXT_PUBLIC_CLERK_USER_PROFILE_URL,
    CRON_SECRET: process.env.CRON_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  server: {
    APP_URL: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_APP_URL ",
    }),
    AUTH_GITHUB_ID: z.string({
      required_error: "Missing env variable: CLIENT_ID",
    }),
    AUTH_GITHUB_SECRET: z.string({
      required_error: "Missing env variable: CLIENT_SECRET",
    }),
    CLERK_PUBLISHABLE_KEY: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    }),
    CLERK_SECRET_KEY: z.string({
      required_error: "Missing env variable: CLERK_SECRET_KEY",
    }),
    CLERK_SIGN_IN_URL: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    }),
    CLERK_SIGN_UP_URL: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_CLERK_SIGN_UP_URL",
    }),
    CLERK_USER_PROFILE_URL: z.string({
      required_error:
        "Missing env variable: NEXT_PUBLIC_CLERK_USER_PROFILE_URL",
    }),
    CRON_SECRET: z.string({
      required_error: "Missing env variable: CRON_SECRET",
    }),
    DATABASE_URL: z.string({
      required_error: "Missing env variable: DATABASE_URL",
    }),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
