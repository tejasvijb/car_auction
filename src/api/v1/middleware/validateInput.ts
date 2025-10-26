import { type NextFunction, type Request, type Response } from "express";
import z from "zod";

/**
 * Middleware factory that creates a validation middleware using a Zod schema
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateInput = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema
      await schema.parseAsync(req.body);

      // If validation passes, move to next middleware
      next();
    } catch (error) {
      // If it's a Zod validation error, send formatted error response
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
          message: "Validation failed",
          status: "error",
        });
      }

      // For any other errors, pass to error handler
      next(error);
    }
  };
};
