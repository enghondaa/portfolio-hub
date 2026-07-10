import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 4000;
const allowedOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3001";

app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
