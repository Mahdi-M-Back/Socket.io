import prisma from "./../../require/prisma.js";

async function create(data) {
  const user = await prisma.user.create({
    data: {
      userName: data.userName,
      password: data.password,
    },
    select: {
      id: true,
      name: true,
      userName: true,
    },
  });

  return user;
}

async function findByUserName(userName) {
  return prisma.user.findUnique({
    where: { userName },
    select: {
      id: true,
      userName: true,
      password: true,
    },
  });
}

async function findByRefreshToken(refreshToken) {
  return prisma.user.findFirst({
    where: {
      refreshToken,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });
}

async function updateRefreshToken(userId, refreshToken) {
  const result = await prisma.user.updateMany({
    where: { id: userId, isDeleted: false },
    data: { refreshToken },
  });
  return result.count > 0;
}

async function update(data, id) {
  try {
    const user = await prisma.user.update({
      where: { id, isDeleted: false },
      data: {
        userName: data.userName,
        updatedAt: new Date(),
      },
      select: {
        userName: true,
      },
    });
    return user;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

async function getMe(id) {
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      userName: true,
    },
  });
}

async function deleteMe(id) {
  const result = await prisma.user.updateMany({
    where: { id, isDeleted: false },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      refreshToken: null,
    },
  });
  return result.count > 0;
}

async function findById(id) {
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      userName: true,
      isDeleted: true,
    },
  });
}

export default {
  create,
  findByUserName,
  findByRefreshToken,
  updateRefreshToken,
  update,
  getMe,
  deleteMe,
  findById,
};
