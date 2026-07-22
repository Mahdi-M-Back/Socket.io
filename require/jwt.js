import jwt from "jsonwebtoken";
import userRepo from "./../module/user/repository.js";

const accessToken = (userId) => {
  const expiresIn = process.env.JWT_SECRET_ACCESS_EXPIRES_IN;
  return jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS, { expiresIn });
};

const refreshToken = (userId) => {
  const expiresIn = process.env.JWT_SECRET_REFRESH_EXPIRES_IN;
  return jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, { expiresIn });
};

function generateTokens(userId, res) {
  const access = accessToken(userId);
  const refresh = refreshToken(userId);

  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });

  return { access, refresh };
}

function generateAccessTokens(userId, refreshToken) {
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    const access = accessToken(userId);

    return { access };
  } catch (err) {
    return false;
  }
}

async function protect(req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(401).json({
      status: "faild",
      data: "Unauthorized access.",
    });
  }
  let decoded;
  const token = req.headers.authorization.split(" ")[1];
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET_ACCESS);
  } catch (error) {
    return res.status(401).json({
      status: "faild",
      data: "You are not logged in. Please log in to get access.",
    });
  }
  const currentuser = await userRepo.findById(decoded.userId);
  if (!currentuser) {
    return res.status(404).json({
      status: "faild",
      data: "User not found.",
    });
  }

  req.user = currentuser;
  next();
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "faild",
        data: "You are not authorized to perform this action.",
      });
    }
    next();
  };
}

export default {
  generateTokens,
  generateAccessTokens,
  protect,
  restrictTo,
};
