import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtUserPayload = {
    id: number;
    role: string;
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("authorization");
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header tidak ada" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ success: false, message: "Format token harus: Bearer <token>" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ success: false, message: "JWT_SECRET belum di-set di server" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === "string") {
            return res.status(403).json({ success: false, message: "Token tidak valid" });
        }

        const id = Number((decoded as any).id);
        const role = String((decoded as any).role ?? "");
        if (!id || !role) {
            return res.status(403).json({ success: false, message: "Token tidak valid" });
        }

        (req as any).user = { id, role } satisfies JwtUserPayload;
        next();
    } catch {
        return res.status(403).json({ success: false, message: "Token tidak valid atau sudah kadaluarsa" });
    }
};