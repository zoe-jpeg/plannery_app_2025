// users.ts (Ensure ALL functions are exported)
import bcrypt from "bcryptjs";

interface User {
    username: string;
    passwordHash: string;
}

// ✅ This MUST be outside all functions so they can access it.
const users: User[] = []; // In-memory "database"

// ... (All exported functions follow this definition)

// ... (Existing User interface and users array)

// ✅ Add 'export'
export async function createUser(username: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { username, passwordHash };
    users.push(user);
    return user;
}

// ✅ Add 'export'
export async function findUser(username: string): Promise<User | undefined> {
    return users.find(u => u.username === username);
}

// ✅ Add 'export'
export async function validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
}
// ...

// ✅ Add 'export' (for the password reset logic)
export async function updateUserPassword(username: string, newPassword: string): Promise<boolean> {
    const user = await findUser(username);
    if (!user) return false;

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    return true;
}
// ...