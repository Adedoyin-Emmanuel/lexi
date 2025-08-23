import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { IGoogleUser } from "./../features/auth/types";
import { GOOGLE_CALLBACK_URL } from "../constants/app";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "I-love-temi",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "I-love-temi",
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      accessType: "offline",
      prompt: "consent",
      scope: ["email", "profile", "openid"],
    } as any,
    (req, accessToken, refreshToken, profile, done) => {
      const user: IGoogleUser = {
        accessToken,
        id: profile.id,
        emails: profile.emails,
        name: profile.displayName,
        provider: profile.provider,
        avatar: profile.photos?.[0]?.value || null,
      };

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
