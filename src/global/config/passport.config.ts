import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport, { type Profile } from 'passport';
import { authService } from '../../features/users/services/auth.service.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
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
