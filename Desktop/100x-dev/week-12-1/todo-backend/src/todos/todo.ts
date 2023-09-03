import { StringValidation } from "zod";

export interface Todo {
    title: string;
    description: string;
    id: string;
    done: boolean;
}