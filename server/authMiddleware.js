import jwt from "jsonwebtoken";
import { findUserById } from "./db.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "studyhub-dev-secret-change-in-production";

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "student",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "არაავტორიზებული" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role || "student",
    };
    return next();
  } catch {
    return res.status(401).json({ error: "სესია ვადაგასულია. შედი თავიდან." });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    const user = await findUserById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "ადმინისტრატორის უფლება საჭიროა" });
    }
    req.user.role = user.role;
    return next();
  } catch {
    return res.status(500).json({ error: "ავტორიზაციის შეცდომა" });
  }
}
