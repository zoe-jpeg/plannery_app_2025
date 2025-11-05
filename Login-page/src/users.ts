import bcrypt from "bcryptjs";

interface User {
  username: string;
  passwordHash: string;
}

const users: User[] = []; // In-memory "database"

export async function createUser(username: string, password: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { username, passwordHash };
  users.push(user);
  return user;
}

export async function findUser(username: string): Promise<User | undefined> {
  return users.find(u => u.username === username);
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
