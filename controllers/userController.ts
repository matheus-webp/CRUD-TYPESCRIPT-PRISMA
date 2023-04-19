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

  async findByValue(value: string) {
    const result = await prisma.user.findFirst({
      where: { OR: [{ email: value }, { username: value }] },
    });
    return result;
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
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
        err: "An user with these credentials already exists",
      };
    }
    await prisma.user.create({
      data: {
        name,
        email,
        username,
        password,
      },
    });
  }

  async remove(password: string, value: string) {
    const user = await this.findByValue(value);
    if (!user) {
      return { statusCode: 400, err: "Invalid credentials" };
    }
    if (!(await hashController.comparePassword(password, user.password))) {
      return { statusCode: 400, err: "Invalid credentials." };
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

  async changePassword(email: string, password: string) {
    if (!password) {
      return { statusCode: 400, err: "Invalid credentials" };
    }
    const user = await this.findByEmail(email);
    if (!user) {
      return { statusCode: 400, err: "User not found" };
    }
    const hashedPassword = await hashController.hashPassword(password);
    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });
  }
}

const userController = new User();

export { userController };
