import { userController } from "./controllers";
import { Router } from "express";
import { hashController } from "./hashController";

export const router = Router();

router.get("/user", async (req, res) => {
  const users = await userController.findAll();
  res.status(200).json({ users });
});

router.post("/user", async (req, res) => {
  const { name, email, username, password } = req.body;
  const hashedPassword = await hashController.hashPassword(password);
  const response = await userController.create(
    name,
    email,
    username,
    hashedPassword
  );
  if (response?.statusCode == 400) {
    return res.send(response.err);
  }
  res.send("User created successfully!");
});

router.delete("/user", async (req, res) => {
  const { password, username, email } = req.body;
  if (!userController.findByUsernameOrEmail(username, email)) {
    return res
      .status(400)
      .json({ err: "At least one field is required. (email/ username)" });
  }
  if (!password) {
    return res.status(400).json({ err: "Password required." });
  }
  const deleteResult = await userController.remove(password, username, email);
  if (deleteResult.statusCode == 400) {
    return res.status(400).json({ err: deleteResult.err });
  }
  if (deleteResult.statusCode == 401) {
    return res.status(401).json({ err: deleteResult.err });
  }
  res.status(200).json({ message: deleteResult.message });
  return;
});

router.patch("/user", async (req, res) => {
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
