import express from 'express'
import { config } from '@/config'
import { User } from '@/models/User'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = express.Router();

// Passport Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: `${config.serverUrl}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ email: profile.emails?.[0].value });
        if (!user) {
          // Create a new user if not found
          user = new User({
            email: profile.emails?.[0].value,
            password: '', // No password for Google-authenticated users
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user for session
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect(`${config.clientUrl}/dashboard`);
  }
);

export { router };
