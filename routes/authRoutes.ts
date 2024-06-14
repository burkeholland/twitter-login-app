import express from 'express';
import passport from 'passport';
import importService from '../services/importService';

const router = express.Router();

router.get('/login', (req, res, next) => {
    const newUserName = req.query.newUserName;
    res.cookie('newUserName', newUserName, { httpOnly: true }); // Set 'newUserName' as a cookie

    console.log('New user query param:', req.query.newUserName);

    // Call passport.authenticate and pass the custom callback URL in the options
    passport.authenticate('twitter')(req, res, next);
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

        const items = await importService.getUserLists(username || '');

        // Send the username in the response
        res.send(`Hello, your Twitter username is: ${username} and you have: ${items.length} lists.`);
    });

// Export the router
export default router;