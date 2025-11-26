import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
export declare function errorHandler(err: Error | ZodError, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.d.ts.map