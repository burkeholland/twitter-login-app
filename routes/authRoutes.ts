import express from 'express';
import passport from 'passport';
import importService from '../services/importService';

const router = express.Router();

router.get('/login', (req, res, next) => {
    const newUsername = req.query.newUsername;
    const newIdentityProvider = req.query.newIdentityProvider;

    if (newUsername && newIdentityProvider) {

        // is the the NODE_ENV development
        if (process.env.NODE_ENV === 'development') {
            // set the username statically from env file
            res.cookie('username', process.env.TWITTER_USERNAME, { httpOnly: true });

            // redirect to /import
            res.redirect('/import/confirm');
        }
        else {

            res.cookie('newUserName', newUsername, { httpOnly: true }); // Set 'newUserName' as a cookie
            res.cookie('newIdentityProvider', newIdentityProvider, { httpOnly: true }); // Set 'newIdentityProvider' as a cookie

            // Call passport.authenticate and pass the custom callback URL in the options
            passport.authenticate('twitter')(req, res, next);
        }
    }

    else {
        res.send('Please provide a new username and identity provider');
    }
});

router.get('/logout', (req, res) => {
    req.logout({}, () => {
        console.log('User is now logged out');
    });
    res.send('You are now logged out');
});

router.get('/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login', failureMessage: true }),
    async function (req, res) {
        // Assuming the Twitter profile is stored in req.user
        const username = req.user?.username as string | undefined;

        // Add the username to the cookie
        res.cookie('username', username, { httpOnly: true });

        // Redirect to /import
        res.redirect('/import/confirm');
    });

// Export the router
export default router;