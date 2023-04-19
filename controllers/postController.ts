import { prisma } from "../dbconfig";

class Post {
  async findPost(id: number) {
    return await prisma.post.findUnique({ where: { id } });
  }

  async createPost(
    authorId: number,
    title: string,
    content: string,
    published: boolean
  ) {
    const newPost = await prisma.post.create({
      data: {
        authorId,
        title,
        content,
        published,
      },
    });
    return newPost;
  }

  async deletePost(postId: number) {
    try {
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      return error;
    }
  }
}

const postController = new Post();
export { postController };
