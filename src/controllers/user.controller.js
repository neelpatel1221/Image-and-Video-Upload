import { User } from "../models/user.model.js";
import { File } from "../models/file.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    await user.save({ validateBeforeSave: false });
    return { accessToken };
  } catch (error) {
    return res.status(500).json({
      error: {
        message: "Something went wrong while generating access token",
      },
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: { message: "User Already Exists!" } });
    }

    const user = await User.create({
      email,
      fullName,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return res.status(500).json({
        data: { message: "Something went wrong while registering the user!" },
      });
    }

    return res.status(200).json({ user: createdUser, success: true });
  } catch (error) {
    return res.json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({ error: { message: "email and password is required" } });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User does not exists" } });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: { message: "Invaild user credentials" } });
    }
    const loggedInUser = await User.findById(user._id).select("-password");
    const accessToken = await generateAccessToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .json({ data: { user: loggedInUser } });
  } catch (error) {
    return res.json(error);
  }
};

const logoutUser = async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .json({ message: "User logged out" });
};

const uploadFile = async (req, res) => {
  try {
    let imagePath = "";
    let videoPath = "";
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      imagePath = req.files.image[0].path;
    }

    if (
      req.files &&
      Array.isArray(req.files.video) &&
      req.files.video.length > 0
    ) {
      videoPath = req.files.video[0].path;
    }

    const image = await uploadOnCloudinary(imagePath);
    const video = await uploadOnCloudinary(videoPath);

    const file = await File.create({
      userId: req.user._id,
      image: image?.url || "",
      video: video?.url || "",
    });

    return res.status(201).json({ image: image?.url, video: video?.url });
  } catch (error) {
    return res.json(error);
  }
};

const getUserVideos = async (req, res) => {
  try {
    const userUploads = await File.find({ userId: req.user._id }).select(
      "-password"
    );
    return res.status(200).json({ data: { userUploads } });
  } catch (error) {
    return res.json(error);
  }
};
export { registerUser, loginUser, uploadFile, getUserVideos, logoutUser };
