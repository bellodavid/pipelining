import express from 'express';
// Import routes with explicit extension for ESM compatibility
import { registerRoutes } from '../server/routes.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any) {
    capturedJsonResponse = bodyJson;
    return originalResJson.call(res, bodyJson);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

// Initialize routes
let handler: express.Express;

// This ensures routes are only registered once
const getHandler = async () => {
  if (!handler) {
    handler = app;
    await registerRoutes(app);
    
    // Error handling
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
  }
  return handler;
};

// Export the serverless function handler
export default async function(req: VercelRequest, res: VercelResponse) {
  const handler = await getHandler();
  return handler(req, res);
}
