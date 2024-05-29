import express, { Express, NextFunction, Request, Response } from "express";
// import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "../routes/authRoutes.js";
import invitationRoutes from "../routes/invitationRoutes.js";
// import todoRoutes from "./routes/todoRoutes.js";

const port = 8000;
const app: Express = express();

app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

//middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, application/json"
  );
  next();
});

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.use("/api/auth", authRoutes);
app.use("/api/inv", invitationRoutes);
// app.use("/api/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
