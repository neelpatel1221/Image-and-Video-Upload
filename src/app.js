import express from "express";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(cookieParser());

// Routes

app.use("/api/v1/user", userRouter);

export { app };
