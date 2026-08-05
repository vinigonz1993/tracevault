import type { Request, Response } from "express";
import { changeLogEmitter } from "../services/changeLogEmitter.js";

export const changeLogEvents = (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 30_000);

  const handler = (changeLog: unknown) => {
    res.write("event: change-log-created\n");
    res.write(`data: ${JSON.stringify(changeLog)}\n\n`);
  };

  changeLogEmitter.on("created", handler);

  req.on("close", () => {
    clearInterval(keepAlive);
    changeLogEmitter.off("created", handler);
  });
};