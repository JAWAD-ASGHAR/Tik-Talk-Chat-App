import { Router } from "express";
import {
  getUserInfo,
  login,
  signup,
  updateProfile,
  deleteProfileImage,
  addProfileImage,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/logout", logout);
authRoutes.post(
  "/add-profile-image",verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
authRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage);

export default authRoutes;
