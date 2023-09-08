import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authenticateJwt } from '../middleware';

const prisma = new PrismaClient();

const Router = express.Router();

Router.post('/todos', authenticateJwt, async (req, res) => {
    const { title, description } = req.body;
    const userIdHeaderValue = req.headers["userId"];

    if (userIdHeaderValue == undefined) {
        return res.status(400).json({ message: 'User ID must be a number' });
    };
    const userId = Number(userIdHeaderValue);

    if (isNaN(userId)) {
        return res.status(400).json('User id must be a number');
    }
    try {
        const newTodo = await prisma.todo.create({
            data: {
                title,
                description,
                userId
            }
        })
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a new todo' })
    }
});

Router.get('/todos', authenticateJwt, async (req, res) => {

    try {
        const userIdHeaderValue = req.headers["userId"];

        if (userIdHeaderValue == undefined) {
            return res.status(400).json({ message: 'User ID must be a number' });
        };
        const userId = Number(userIdHeaderValue);

        if (isNaN(userId)) {
            return res.status(500);
        }
        const todos = await prisma.todo.findMany({
            where: {
                userId: userId
            }
        });
        if (todos) {
            res.status(200).json(todos);
        } else {
            res.status(400).json({ error: 'Todo not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrive todos' })
    }
});

Router.patch('/todos/:todoId/done', authenticateJwt, async (req, res) => {

    try {
        const todoId = parseInt(req.params.todoId);
        const userIdHeaderValue = req.headers["userId"];

        if (userIdHeaderValue == undefined) {
            return res.status(400).json({ message: 'User ID must be a number' });
        };
        const userId = Number(userIdHeaderValue);

        if (isNaN(userId)) {
            return res.status(500);
        }
        const updatedTodos = await prisma.todo.updateMany({
            where: {
                userId: userId,
                id: todoId
            },
            data: {
                done: true,
            }
        });
        if (updatedTodos) {
            res.status(200).json(updatedTodos);
        } else {
            res.status(400).json({ error: 'Todo not found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todos' })
    }
});

export default Router;