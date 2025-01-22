const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/userModel")

// Load enviorment variables
require("dotenv").config()


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const image = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        if (!user) {
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: email,
                image: image
            });
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null)
    }
}))


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const image = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

            user = new User({
                githubId: profile.id,
                displayName: profile.displayName,
                email: email,
                image: image
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null)
    }
}))


module.exports = {
    loginWithGoogle: passport.authenticate("google", { scope: ["profile", "email"] }),
    GoogleCallback: passport.authenticate("google", {
        successRedirect: "https://google-github-authentication.netlify.app",
        failureRedirect: "https://google-github-authentication.netlify.app/login"
    }),

    loginWithGitthub: passport.authenticate("github", { scope: ["profile", "email"] }),
    GithubCallback: passport.authenticate("github", {
        successRedirect: "https://google-github-authentication.netlify.app",
        failureRedirect: "https://google-github-authentication.netlify.app/login"
    }),


    serializeUser: (user, done) => done(null, user),
    deserializeUser: (user, done) => done(null, user),
}