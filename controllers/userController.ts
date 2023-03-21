import { prisma } from "../dbconfig";
import { hashController } from "../hashController";

class User {
  // ... you will write your Prisma Client queries here

  async findAll() {
    return await prisma.user.findMany();
  }

  async findByUsernameOrEmail(username?: string, email?: string) {
    const result = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    return result;
  }

  async create(
    name: string,
    email: string,
    username: string,
    password: string
  ) {
    const userAlreadyExists = await this.findByUsernameOrEmail(username, email);
    if (userAlreadyExists) {
      return {
        statusCode: 400,
        err: "An username with these credentials already exists",
      };
    }
    await prisma.user.create({
      data: {
        name,
        email,
        username,
        password,

        posts: {
          create: {
            title: "Hello World",
          },
        },
      },
    });
  }

  async remove(password: string, username?: string, email?: string) {
    const user = await this.findByUsernameOrEmail(username, email);
    if (!user) {
      return { statusCode: 400, err: "User not found" };
    }
    if (!(await hashController.comparePassword(password, user.password))) {
      return { statusCode: 401, err: "Wrong password." };
    }
    await prisma.post.deleteMany({ where: { authorId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    return { statusCode: 200, message: "User deleted successfully." };
  }

  async changeUsername(username: string, newUsername: string) {
    const user = await this.findByUsernameOrEmail(username);
    if (!user) {
      return { statusCode: 400, err: "User not found" };
    }
    const newUser = await this.findByUsernameOrEmail(newUsername);
    if (newUser) {
      return {
        statusCode: 400,
        err: "An user with this username already exists.",
      };
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { username: newUsername },
    });
    return { statusCode: 200, message: "Username changed!" };
  }
}

const userController = new User();

export { userController };
