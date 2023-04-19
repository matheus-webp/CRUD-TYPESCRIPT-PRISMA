import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const generateToken = (payload: { id: number }) => {
  return jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "1h" });
};

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ err: "No token or invalid token provided" });
  }
  const authToken = authHeader.split(" ");
  const token = authToken[1];

  try {
    jwt.verify(token, process.env.SECRET_KEY!);
    next();
  } catch (error) {
    return res.status(400).json({ err: error });
  }
}

const validateToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY!);
  } catch (error) {
    return undefined;
  }
};

const decodedToken = (token: string) => {
  return jwt.decode(token);
};

export { verifyToken, generateToken, validateToken, decodedToken };
