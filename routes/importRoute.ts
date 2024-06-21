import express, { Request, Response } from 'express';
import importService from '../services/importService';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', async (req, res, next) => {
    // Retrieve the new username and identity provider from the cookies
    const newUsername = req.cookies.newUserName;
    const newIdentityProvider = req.cookies.newIdentityProvider;
    const username = req.cookies.username;

    await importService.importLists(username, newUsername, newIdentityProvider);

    res.send("Feels like it happened");
});

router.get('/confirm', async (req: Request, res: Response) => {
    // Retrieve the new username and identity provider from the cookies
    const newUsername = req.cookies.newUserName;
    const newIdentityProvider = req.cookies.newIdentityProvider;
    const username = req.cookies.username;

    const listCount = await importService.getUserListsCount(username || '');

    res.render('index', { username, listCount, newUsername, newIdentityProvider });
});

export default router;