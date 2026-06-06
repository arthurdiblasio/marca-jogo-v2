import bcrypt from "bcryptjs";

export const passwordHasher = {
  hash(password: string) {
    return bcrypt.hash(password, 12);
  },

  compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
};
