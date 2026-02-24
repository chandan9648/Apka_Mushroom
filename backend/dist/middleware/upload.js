import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";
const maxBytes = env.MAX_UPLOAD_MB * 1024 * 1024;
export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dest = env.UPLOADS_DIR;
            fs.mkdirSync(dest, { recursive: true });
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "");
            cb(null, `${Date.now()}-${base}${ext}`);
        }
    }),
    limits: { fileSize: maxBytes }
});
