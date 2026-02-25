import dotenv from "dotenv";
import "dotenv/config";

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { connectDb } from "./db/connect.js";

dotenv.config();

async function main() {
  await connectDb();

  const app = createApp();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });

  app.set("io", io);

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend Server is listening on : ${port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
