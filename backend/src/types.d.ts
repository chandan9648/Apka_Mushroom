import type { Server as SocketIOServer } from "socket.io";

declare module "express-serve-static-core" {
  interface Application {
    get(name: "io"): SocketIOServer;
  }
}
