import mongoose from "mongoose";
import Channel from "../modals/channelModal.js";
import User from "../modals/userModal.js";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;
    const admin = User.findById(userId);
    if (!admin) {
      return response.status(400).send({ message: "Admin not found!" });
    }
    const valideMembers = await User.find({ _id: { $in: members } });

    if (valideMembers.length !== members.length) {
      return response.status(400).send({ message: "Some users not found!" });
    }

    const newChannel = new Channel({ name, admin: userId, members });
    await newChannel.save();
    response.status(200).json({ channel: newChannel });
  } catch (error) {
    return response.status(500).send({ message: "internal server error!" });
  }
};

export const getUserChannels = async (request, response, next) => {
  try {
    console.log("getUserChannels");
    console.log(`request.userId: ${request.userId}`);
    const userId = new mongoose.Types.ObjectId(request.userId);
    console.log(`userId: ${userId}`);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    console.log(`channels: ${channels}`);
    response.status(200).json({ channels });
  } catch (error) {
    console.error("Error in getUserChannels: ", error);
    return response.status(500).send({ message: "internal server error!" });
  }
};

