import express from "express";
import organizationRoutes from "./routes/organization.routes.js";
import loginRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "TraceVault API running",
  });
});

app.use("/auth", loginRoutes);
app.use("/organizations", organizationRoutes);

export default app;