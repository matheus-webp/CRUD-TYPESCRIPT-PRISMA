import { userController } from "../controllers";
import { Router } from "express";
import { hashController } from "../hashController";
import {
  verifyToken as auth,
  decodedToken,
  generateToken,
  validateToken,
} from "../authentication/auth";
import { Request, Response } from "express";
import { sendEmail } from "../emailService";

export const router = Router();

router.get("/user", async (req: Request, res: Response) => {
  const users = await userController.findAll();
  res.status(200).json({ users });
});

router.post("/user", async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;
  const hashedPassword = await hashController.hashPassword(password);
  const response = await userController.create(
    name,
    email,
    username,
    hashedPassword
  );
  if (response?.statusCode == 400) {
    return res.json({ err: response.err });
  }
  res.status(200).json({ message: "User created successfully!" });
});

router.delete("/user", auth, async (req: Request, res: Response) => {
  const { password, value } = req.body;
  if (!userController.findByValue(value)) {
    return res
      .status(400)
      .json({ err: "At least one field is required. (email/ username)" });
  }
  if (!password) {
    return res.status(400).json({ err: "Password required." });
  }
  const deleteResult = await userController.remove(password, value);
  if (deleteResult.statusCode == 400) {
    return res.status(400).json({ err: deleteResult.err });
  }
  if (deleteResult.statusCode == 401) {
    return res.status(401).json({ err: deleteResult.err });
  }
  res.status(200).json({ message: deleteResult.message });
  return;
});

router.patch("/user", auth, async (req: Request, res: Response) => {
  const { username, newUsername } = req.body;
  const changeResult = await userController.changeUsername(
    username,
    newUsername
  );
  if (changeResult.statusCode == 400) {
    return res.status(400).json({ err: changeResult.err });
  }
  return res.status(200).json({ message: changeResult.message });
});

router.post("/login", async (req: Request, res: Response) => {
  const { value, password } = req.body;
  if (!value) {
    return res.status(400).json({
      err: "Need at least an username or email",
    });
  }
  if (!password) {
    return res.status(400).json({ err: "Need a password" });
  }
  const user = await userController.findByValue(value);
  if (!user) {
    return res.status(400).json({ err: "Invalid credentials" });
  }
  if (!(await hashController.comparePassword(password, user.password))) {
    return res.status(400).json({ err: "Invalid credentials" });
  }
  const decodedToken = generateToken({ id: user.id });
  return res
    .header("authorization", `Bearer ${decodedToken}`)
    .json({ token: decodedToken });
});

router.post("/recover_password", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ err: "Invalid credentials" });
  }
  sendEmail(email);
  return res.status(200).json({ message: "Recovery email sent!" });
});

router.post("/change_password/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  const isValid = validateToken(token);
  if (!isValid) {
    return res.status(400).json({ err: "No token or invalid token provided" });
  }
  if (!password) {
    return res.status(400).json({ err: "Need a password" });
  }
  const userEmail = decodedToken(token);
  if (typeof userEmail === "string") {
    await userController.changePassword(userEmail, password);
    return res.status(200).json({ message: "Password changed!" });
  }
  return res.status(400).json({ err: "No token or invalid token provided" });
});
