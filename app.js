import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.route.js";
import flatRouter from "./src/routes/flat.route.js";
import societyRouter from "./src/routes/society.route.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Well-come");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/flat", flatRouter);
app.use("api/v1/society", societyRouter);
export default app;
