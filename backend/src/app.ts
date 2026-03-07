import express  from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import boletoRoutes from "./routes/boletoRoutes";
import errorMiddleware from "./middleware/ErrorMidleware";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send("It's works!");
});

app.use("/auth", authRoutes);
app.use("/boleto", boletoRoutes);

app.use(errorMiddleware);

export default app;