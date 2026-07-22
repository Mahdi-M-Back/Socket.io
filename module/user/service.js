import jwt from "./../../require/jwt.js";
import repository from "./repository.js";
import { loginSchema, registerSchema } from "./schema.js";
import bcrypt from "bcrypt";

async function create(data) {
  const validated = registerSchema.parse(data);
  const existingUser = await repository.findByEmail(validated.email);
  if (existingUser) {
    return false;
  }
  const password = await bcrypt.hash(validated.password, 12);
  validated.password = password;
  const user = await repository.create(validated);

  return user;
}

async function login(data, res) {
  const validated = loginSchema.parse(data);

  const user = await repository.findByEmail(validated.email);
  if (!user) {
    return false;
  }

  const confirmPass = await bcrypt.compare(validated.password, user.password);
  if (!confirmPass) {
    return false;
  }
  user.password = undefined;
  const tokens = await jwt.generateTokens(user.id, res);
  const accessToken = tokens.access;
  const refreshToken = tokens.refresh;
  await repository.updateRefreshToken(user.id, refreshToken);

  return { user, accessToken };
}

async function refreshToken(refreshToken) {
  const user = await repository.findByRefreshToken(refreshToken);
  if (!user) {
    return false;
  }

  const tokens = await jwt.generateAccessTokens(user.id, refreshToken);

  return tokens;
}

async function update(name, userId) {
  const updatedUser = await repository.update(name, userId );
  if (!updatedUser) {
    return false;
  }
  return updatedUser;
}
async function getMe(userId) {
  const user = await repository.getMe(userId);
  if (!user) {
    return false;
  }
  return user;
}
async function deleteMe(userId) {
  const deleteUser = await repository.deleteMe(userId);
  if (!deleteUser) {
    return false;
  }
  return true;
}

export default {
  create,
  login,
  refreshToken,
  update,
  getMe,
  deleteMe,
};
