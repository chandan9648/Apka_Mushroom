import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./db/connect.js";

async function main() {
  await connectDb();

  const app = createApp();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });

  app.set("io", io);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`FungiVerse API listening on :${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
