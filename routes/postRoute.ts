import { Router } from "express";
import { Request, Response } from "express";
import { postController } from "../controllers";
import { verifyToken as auth } from "../authentication/auth";

export const postRouter = Router();

postRouter.post(
  "/create_post/:id",
  auth,
  async (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id);
    const { title, content } = req.body;
    if (!authorId || !title || !content) {
      res.status(400).json({ err: "Missing fields" });
    }
    const published = true;
    await postController.createPost(authorId, title, content, published);
    res.status(200).json({ message: "Post created successfully" });
  }
);

postRouter.post(
  "/delete_post/:id",
  auth,
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id);
    if (!postId) {
      res.status(400).json({ err: "Missing fields" });
    }
    await postController.deletePost(postId);
    res.status(200).json({ message: "Post removed successfully" });
  }
);
