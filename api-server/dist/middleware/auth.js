"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRequest = authenticateRequest;
const supabase_1 = require("../config/supabase");
/**
 * Middleware to authenticate requests using Supabase Auth token
 * Expects Authorization header: "Bearer <token>"
 */
async function authenticateRequest(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Yetkisiz erişim", error: "Missing or invalid authorization header" });
        }
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ message: "Yetkisiz erişim", error: error?.message });
        }
        req.user = {
            id: user.id,
            email: user.email,
        };
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: "Yetkisiz erişim", error: "Authentication failed" });
    }
}
//# sourceMappingURL=auth.js.map