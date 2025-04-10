import express from "express";
import cors from "cors";
import router from "./routes/index";

const app = express();
app.use(cors()).use(express.json()).use(router)

export default app;
