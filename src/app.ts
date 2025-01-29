import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
app.use(cors())

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
