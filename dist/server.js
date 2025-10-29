"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PORT = 3000;
const server = http_1.default.createServer((req, res) => {
    // /view-image 경로 처리
    if (req.url === "/view-image" && req.method === "GET") {
        // dist/server.js 실행 기준 → dist/images/veryhappydog.jpg
        const imagePath = path_1.default.resolve(__dirname, "./images/veryhappydog.jpg");
        fs_1.default.access(imagePath, fs_1.default.constants.F_OK, (notFound) => {
            if (notFound) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain; charset=utf-8");
                res.end("Image not found");
                return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "image/jpeg");
            const stream = fs_1.default.createReadStream(imagePath);
            stream.on("error", () => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain; charset=utf-8");
                res.end("Error reading image file");
            });
            stream.pipe(res);
        });
        return;
    }
    // 루트 페이지
    if (req.url === "/" && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(`
      <h1>NodeJS - File System Exercise</h1>
      <p>이미지를 보려면 <a href="/view-image">/view-image</a> 로 이동하세요.</p>
    `);
        return;
    }
    // 기타 경로: 404
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Not Found");
});
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}/view-image`);
});
