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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("../middleware");
const prisma = new client_1.PrismaClient();
const Router = express_1.default.Router();
Router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (user) {
            res.status(403).json({ message: 'User already exists' });
        }
        else {
            const newUser = yield prisma.user.create({
                data: {
                    email: email,
                    password: password
                }
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser.id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created Successfully', token });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'error' });
    }
}));
Router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            email: email,
            password: password
        }
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user.id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token, userId: user.id });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
}));
Router.get('/me', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdHeaderValue = req.headers["userId"];
    if (userIdHeaderValue == undefined) {
        return res.status(400).json({ message: 'User ID must be a number' });
    }
    ;
    const userId = Number(userIdHeaderValue);
    if (isNaN(userId)) {
        return res.status(500);
    }
    const user = yield prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (user) {
        return res.json({ username: user.email });
    }
    else {
        res.status(403).json({ message: 'User not logged in' });
    }
}));
exports.default = Router;
