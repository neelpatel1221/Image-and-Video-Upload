import { Router } from "express";
import {
  getUserVideos,
  loginUser,
  logoutUser,
  registerUser,
  uploadFile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/upload").post(
  verifyJWT,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadFile
);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/user-info").get(verifyJWT, getUserVideos);

export default router;
