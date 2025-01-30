import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user-routes";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
app.use(cors()).use(express.json())

app.use(userRoutes)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
