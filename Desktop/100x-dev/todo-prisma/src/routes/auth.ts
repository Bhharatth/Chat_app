import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from "jsonwebtoken";
import { SECRET, authenticateJwt } from '../middleware';

const prisma = new PrismaClient();

const Router = express.Router();

Router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (user) {
            res.status(403).json({ message: 'User already exists' });
        } else {
            const newUser = await prisma.user.create({
                data: {
                    email: email,
                    password: password
                }
            });
            const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created Successfully', token });
        }
    } catch (error) {
        res.status(500).json({ message: 'error' });
    }
});

Router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
            password: password
        }
    });
    if (user) {
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token ,userId:user.id});
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

Router.get('/me', authenticateJwt, async (req, res) => {
    const userIdHeaderValue = req.headers["userId"];

    if (userIdHeaderValue == undefined) {
        return res.status(400).json({ message: 'User ID must be a number' });
    };
    const userId = Number(userIdHeaderValue);

    if (isNaN(userId)) {
        return res.status(500);
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (user) {
        return res.json({ username: user.email });
    } else {
        res.status(403).json({ message: 'User not logged in' });
    }

});




export default Router;


