import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const { accessToken } =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: { message: "Unauthorized request" } });
    }
    const decodedTokenInformation = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedTokenInformation?._id).select(
      "-password"
    );
    if (!user) {
      return res
        .status(401)
        .json({ error: { message: "Invalid Access Token" } });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: "Invalid Access Token" } });
  }
};
