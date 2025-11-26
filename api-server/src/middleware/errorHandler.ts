import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: Error | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("API Error:", err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Geçersiz veri",
      errors: err.errors,
    });
  }

  // Generic errors
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

