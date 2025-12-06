import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import apiRouter from "./src/routes/index.js";
import dbConnect from "./database/dbconnect.js";

import dotenv from "dotenv";
import { errorHandler } from "./src/middleware/errorHandler.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8001;

dbConnect();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(express.static(join(__dirname, "public")));


app.use("/api", apiRouter);


app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server Started Successfully Listening on Port: ${PORT}`
    );
});
