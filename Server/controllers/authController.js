import User from "../modals/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "email and password are required!" });
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge: maxAge,
      secure: true,
      sameSite: "none",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: "internal server error!" });
  }
};

export const login = async (request, response, next) => {
  try {
    console.log("Login attempt:", request.body);
    const { email, password } = request.body;
    if (!email || !password) {
      console.warn("Email or password missing in request");
      return response
        .status(400)
        .json({ message: "email and password are required!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`User not found for email: ${email}`);
      return response.status(404).json({ message: "user not found!" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      console.warn("Invalid password attempt");
      return response.status(400).json({ message: "invalid password!" });
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge: maxAge,
      secure: true,
      sameSite: "none",
    });
    // console.log("User logged in successfully:", user.id);
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "internal server error!" });
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData)
      return response
        .status(404)
        .json({ message: "User with given ID not found!" });

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "internal server error!" });
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const userId = request.userId;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName || color === null) {
      return response.status(400).json({ message: "All fields are required!" });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "internal server error!" });
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "File is required!" });
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "internal server error!" });
  }
};

export const deleteProfileImage = async (request, response, next) => {
  try {
    const userId = request.userId;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found!" });
    }

    if (!user.image) {
      return response.status(400).json({ message: "No image to delete!" });
    }

    if(user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    user.save();

    return response.status(200).send("Image deleted successfully!");;
  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "internal server error!" });
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1 , secure: true, sameSite: "none"});
    return response.status(200).json({ message: "logout successful!" });
  } catch (error) {
    console.error("Error during logout:", error);
    return response.status(500).json({ message: "internal server error!" });
  }
};
