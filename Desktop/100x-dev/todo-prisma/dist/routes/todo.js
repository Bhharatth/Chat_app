"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const prisma = new client_1.PrismaClient();
const Router = express_1.default.Router();
Router.post('/todos', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    const userIdHeaderValue = req.headers["userId"];
    if (userIdHeaderValue == undefined) {
        return res.status(400).json({ message: 'User ID must be a number' });
    }
    ;
    const userId = Number(userIdHeaderValue);
    if (isNaN(userId)) {
        return res.status(400).json('User id must be a number');
    }
    try {
        const newTodo = yield prisma.todo.create({
            data: {
                title,
                description,
                userId
            }
        });
        res.status(201).json(newTodo);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create a new todo' });
    }
}));
Router.get('/todos', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdHeaderValue = req.headers["userId"];
        if (userIdHeaderValue == undefined) {
            return res.status(400).json({ message: 'User ID must be a number' });
        }
        ;
        const userId = Number(userIdHeaderValue);
        if (isNaN(userId)) {
            return res.status(500);
        }
        const todos = yield prisma.todo.findMany({
            where: {
                userId: userId
            }
        });
        if (todos) {
            res.status(200).json(todos);
        }
        else {
            res.status(400).json({ error: 'Todo not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrive todos' });
    }
}));
Router.patch('/todos/:todoId/done', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = parseInt(req.params.todoId);
        const userIdHeaderValue = req.headers["userId"];
        if (userIdHeaderValue == undefined) {
            return res.status(400).json({ message: 'User ID must be a number' });
        }
        ;
        const userId = Number(userIdHeaderValue);
        if (isNaN(userId)) {
            return res.status(500);
        }
        const updatedTodos = yield prisma.todo.updateMany({
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
        }
        else {
            res.status(400).json({ error: 'Todo not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update todos' });
    }
}));
exports.default = Router;
