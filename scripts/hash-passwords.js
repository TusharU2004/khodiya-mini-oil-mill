// scripts/hash-passwords.js
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

async function hashPasswords() {
  let connection;
  try {
    console.log('Connecting to the database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('Database connection successful.');

    console.log('Fetching users...');
    const [users] = await connection.execute('SELECT id, password FROM users');
    console.log(`Found ${users.length} users.`);

    let updatedCount = 0;
    for (const user of users) {
      // Check if the password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password && user.password.startsWith('$2')) {
        console.log(`User ID ${user.id} password already hashed. Skipping.`);
        continue;
      }

      if (!user.password) {
        console.log(`User ID ${user.id} has no password. Skipping.`);
        continue;
      }

      console.log(`Hashing password for user ID ${user.id}...`);
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

      await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
      console.log(`User ID ${user.id} password updated.`);
      updatedCount++;
    }

    if (updatedCount > 0) {
      console.log(`
✅ Successfully updated ${updatedCount} user passwords.`);
    } else {
      console.log('\n✅ No passwords needed to be updated.');
    }

  } catch (error) {
    console.error('❌ An error occurred:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

hashPasswords();
