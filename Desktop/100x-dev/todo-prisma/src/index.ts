import express from "express";
const app = express();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const port = 3000;
import authRoutes from "./routes/auth"
import todoRoutes from "./routes/todo"

import cors from "cors";
app.use(cors());
app.use(express.json());

app.use("/auth",  authRoutes);
app.use("/todo",  todoRoutes);

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
});

prisma.$connect().then(()=> {
    console.log("Connected to database");
}).catch((error)=> {
    console.log(error);
})