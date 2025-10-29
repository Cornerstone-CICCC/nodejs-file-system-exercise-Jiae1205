import http from "http";
import fs from "fs";
import path from "path";

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/view-image" && req.method === "GET") {
    const imagePath = path.resolve(__dirname, "./images/veryhappydog.jpg");

    fs.access(imagePath, fs.constants.F_OK, (notFound) => {
      if (notFound) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Image not found");
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "image/jpeg");

      const stream = fs.createReadStream(imagePath);
      stream.on("error", () => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Error reading image file");
      });
      stream.pipe(res);
    });
    return;
  }

  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <h1>NodeJS - File System Exercise</h1>
      <p>이미지를 보려면 <a href="/view-image">/view-image</a> 로 이동하세요.</p>
    `);
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/view-image`);
});
