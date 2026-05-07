import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Figma Plugin → Web App 브릿지 미들웨어
function figmaBridge() {
  let pendingData = null;

  return {
    name: "figma-bridge",
    configureServer(server) {
      // Plugin이 POST로 프레임 데이터 전송
      server.middlewares.use("/api/figma-import", (req, res, next) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => { body += chunk; });
          req.on("end", () => {
            try {
              pendingData = JSON.parse(body);
              pendingData._receivedAt = Date.now();
              res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end(JSON.stringify({ ok: true, frames: pendingData.frames?.length || 0 }));
            } catch (e) {
              res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
              res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
            }
          });
          return;
        }

        if (req.method === "GET") {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          if (pendingData) {
            const data = pendingData;
            pendingData = null; // 한 번 읽으면 소비
            res.end(JSON.stringify(data));
          } else {
            res.end(JSON.stringify(null));
          }
          return;
        }

        // CORS preflight
        if (req.method === "OPTIONS") {
          res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          });
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), figmaBridge()],
});
