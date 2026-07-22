import pool from "@/config/database.js";

async function create(data) {
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password)
    VALUES($1,$2,$3)
    RETURNING 
    id,
    name,
    email
    `,
    [data.name, data.email, data.password],
  );

  return result.rows[0];
}

async function findByEmail(email) {
  const result = await pool.query(
    `
    SELECT 
    id,
    name,
    email,
    password
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

async function findByRefreshToken(refreshToken) {
  const result = await pool.query(
    `
    SELECT 
    id
    FROM users
    WHERE refresh_token = $1 AND is_deleted = false
    `,
    [refreshToken],
  );

  return result.rows[0] ?? null;
}

async function updateRefreshToken(userId, refreshToken) {
  const result = await pool.query(
    `
    UPDATE users
    SET refresh_token = $1
    WHERE id = $2
    `,
    [refreshToken, userId],
  );
  return result.rows[0] ?? null;
}

async function update(name, id) {
  const result = await pool.query(
    `UPDATE users
    SET 
      name = $1,
      updated_at = $2
    WHERE 
      id = $3
      AND
      is_deleted = false
    RETURNING 
    name,
    email
    `,
    [name, new Date(), id],
  );

  return result.rows[0] ?? null;
}

async function getMe(id) {
  const result = await pool.query(
    `
    SELECT 
      name,
      email
    FROM users
    WHERE 
      is_deleted = false 
      AND 
      id = $1
    `,
    [id],
  );
  return result.rows[0] ?? null;
}

async function deleteMe(id) {
  const result = await pool.query(
    `
    UPDATE users
    SET 
      is_deleted = true,
      deleted_at = $1,
      refresh_token = null
      WHERE 
      id = $2
      `,
    [new Date(), id],
  );
  return true ?? null;
}

async function findById(id) {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE id = $1
    `,
    [id],
  );
  return result.rows[0] ?? null;
}

export default {
  create,
  findByEmail,
  findByRefreshToken,
  updateRefreshToken,
  update,
  getMe,
  deleteMe,
  findById,
};
