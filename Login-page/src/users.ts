import bcrypt from "bcryptjs";

interface User {
  username: string;
  passwordHash: string;
}

const users: User[] = [];

export async function createUser(username: string, password: string): Promise<User> {
  console.log("createUser called for:", username);
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { username, passwordHash };
  users.push(user);
  console.log("User added:", username);
  return user;
}

export async function findUser(username: string): Promise<User | undefined> {
  const user = users.find(u => u.username === username);
  return user;
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateUserPassword(username: string, newPassword: string): Promise<boolean> {
  const user = await findUser(username);
  if (!user) return false;
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  return true;
}
