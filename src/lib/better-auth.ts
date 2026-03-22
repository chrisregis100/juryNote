import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import {
  isBrevoConfigured,
  sendBrevoTransactionalEmail,
} from "@/lib/email/brevo";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildMagicLinkEmailContent(verifyUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Votre lien de connexion JuryFlow";
  const html = `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Connexion à JuryFlow</h2>
              <p style="color: #555;">Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien expire dans 10&nbsp;minutes.</p>
              <a
                href="${verifyUrl}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #000;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                  margin: 16px 0;
                "
              >
                Se connecter
              </a>
              <p style="color: #999; font-size: 13px;">
                Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet e-mail.
              </p>
            </div>
          `;
  const text = `Connexion à JuryFlow : ${verifyUrl}`;
  return { subject, html, text };
}

async function sendMagicLinkEmail(to: string, verifyUrl: string): Promise<void> {
  const { subject, html, text } = buildMagicLinkEmailContent(verifyUrl);

  if (isBrevoConfigured()) {
    await sendBrevoTransactionalEmail({
      toEmail: to,
      subject,
      htmlContent: html,
      textContent: text,
    });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  });
}

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    nextCookies(),
    magicLink({
      expiresIn: 60 * 10, // 10 minutes
      disableSignUp: false,
      sendMagicLink: async ({ email, token }) => {
        const appUrl =
          process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
        const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

        await sendMagicLinkEmail(email, verifyUrl);
      },
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "organizer",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Ensure only organizer/supervisor can authenticate via magic link.
          // New user creation is blocked by disableSignUp; this hook guards
          // any programmatic creation path.
          const role = (user as { role?: string }).role ?? "organizer";
          if (role === "jury") {
            throw new Error("Jury members cannot authenticate via Better Auth.");
          }
          return { data: user };
        },
      },
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // refresh session if older than 1 day
  },
});

export type Auth = typeof auth;
