import bcrypt from "bcrypt";

class HashController {
  async hashPassword(rawPassword: string) {
    return await bcrypt.hash(rawPassword, 10);
  }

  async comparePassword(rawPassword: string, hashedPassword: string) {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }
}

const hashController = new HashController();
export { hashController };
