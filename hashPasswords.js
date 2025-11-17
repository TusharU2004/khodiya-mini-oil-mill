import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

async function convertPasswords() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "your_db"
  });

  const [users] = await db.query("SELECT id, password FROM users");

  for (let user of users) {
    // Skip if already bcrypt hashed
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      continue;
    }

    // Hash the plain text password
    const hashed = await bcrypt.hash(user.password, 10);

    // Update DB
    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, user.id]
    );

    console.log(`Updated user ${user.id}`);
  }

  db.end();
}

convertPasswords();
