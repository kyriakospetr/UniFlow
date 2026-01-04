import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport, { type Profile } from 'passport';
import { authService } from '../../features/auth/services/auth.service.ts';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
    try {
      const userToken = await authService.syncOAuthProfile(profile);
      return done(null, userToken);
    } catch (error) {
      return done(error, false);
    }
  }
));