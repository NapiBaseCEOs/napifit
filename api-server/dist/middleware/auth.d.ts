import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
    };
}
/**
 * Middleware to authenticate requests using Supabase Auth token
 * Expects Authorization header: "Bearer <token>"
 */
export declare function authenticateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map