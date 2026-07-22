import service from "./service.js";

export async function signup(req, res) {
  const user = await service.create(req.body);

  if (!user) {
    return res.status(409).json({
      status: "faild",
      data: "User already exists.!",
    });
  }

  return res.status(201).json({
    status: "success",
    data: user,
  });
}

export async function login(req, res) {
  const user = await service.login(req.body, res);
  if (!user) {
    return res.status(404).json({
      status: "faild",
      data: "Your password or email is wrong.!",
    });
  }
  return res.status(200).json({
    status: "success",
    data: user,
  });
}

export async function logout(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    status: "success",
    data: "Logged out successfully.",
  });
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      status: "faild",
      data: "Refresh token not found.",
    });
  }
  const tokens = await service.refreshToken(refreshToken);
  if (!tokens) {
    return res.status(401).json({
      status: "faild",
      data: "Invalid refresh token.",
    });
  }

  return res.status(200).json({
    status: "success",
    data: tokens,
  });
}

export async function updateMe(req, res) {
  const update = await service.update(req.body.name, req.user.id);
  if (!update) {
    return res.status(404).json({
      status: "Fail",
      data: "The updated going to fail. Try again later.!",
    });
  }

  return res.status(201).json({
    status: "Success",
    data: update,
  });
}

export async function getMe(req, res) {
  const user = await service.getMe(req.user.id);
  if (!user) {
    return res.status(404).json({
      status: "Fail",
      data: "User not found.!",
    });
  }

  return res.status(200).json({
    status: "Success",
    data: user,
  });
}

export async function deleteMe(req, res) {
  const deleted = await service.deleteMe(req.user.id);
  if (!deleted) {
    return res.status(404).json({
      status: "Fail",
      data: "User not found.!",
    });
  }

  return res.status(200).json({
    status: "Success",
  });
}
