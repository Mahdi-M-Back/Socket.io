import jwt from "./../../require/jwt.js";
import repository from "./repository.js";
import bcrypt from "bcrypt";

async function create(data) {
  const existingUser = await repository.findByUserName(data.userName);
  if (existingUser) {
    return false;
  }
  const password = await bcrypt.hash(data.password, 12);
  data.password = password;
  const user = await repository.create(data);

  return user;
}

async function login(data, res) {
  const user = await repository.findByUserName(data.userName);
  if (!user) {
    return false;
  }

  const confirmPass = await bcrypt.compare(data.password, user.password);
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

async function refreshToken(refreshToken, res) {
  const user = await repository.findByRefreshToken(refreshToken);
  if (!user) {
    return false;
  }

  const tokens = await jwt.generateAccessTokens(user.id, res);
  await repository.updateRefreshToken(user.id, tokens.refresh);

  return tokens;
}

async function update(data, userId) {
  const updatedUser = await repository.update(data, userId);
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
