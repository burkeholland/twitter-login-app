import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import importRoute from './routes/importRoute';

const app = express();
const PORT = 3000;

// At the top of your app.ts or in a custom .d.ts file
declare global {
    namespace Express {
        interface User {
            username?: string;
            id: any;
        }
    }
}

// Replace 'YOUR_TWITTER_CONSUMER_KEY' and 'YOUR_TWITTER_CONSUMER_SECRET' with your actual Twitter API keys
passport.use(new TwitterStrategy({
    consumerKey: 'BaRKX9l9r4N5Gfl7Lh8Bz2qgo',
    consumerSecret: 'pKPVQZlNcLxpx8sgSpd4wwYEgAVmDJWEYzNPYc9nfY2uVKaICP',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
},
    function (token, tokenSecret, profile, done) {
        // In a production app, you might want to save the profile information in a database
        // For this example, we'll just pass the profile to the callback
        return done(null, profile);
    }
));

// Session configuration
app.use(session({
    secret: '+u+S99ru5RqkypAibjFSTiYICEMV99eKxzggGnOAcqw=', // Replace 'yourSecretKey' with a real secret key
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // In production, set the secure flag to true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.set('view engine', 'pug');

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id); // Assuming your user object has an id field
});

// Deserialize user
passport.deserializeUser((id, done) => {
    // Here you would find the user in your database by its ID
    // For this example, we'll just pass the user ID to the callback
    done(null, { id: id }); // Replace this with your user object retrieval logic
});

app.use('/auth', authRoutes);
app.use('/import', importRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});