import cors from "cors";
import express from "express";
import changeLogRoutes from "./routes/changelog.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
)
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "TraceVault API running",
  });
});

app.use("/", changeLogRoutes);

export default app;