import express from "express";
// use .env file to store variables
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req,res) => {
    res.send("Hello world!");
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});