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

export const getChannelMessages = async (request, response, next) => {
  try {
    const {channelId} = request.params;
    const channel = await Channel.findById(channelId).populate({path: "messages", populate: {path: "sender", select: "firstName lastName email _id image color"}});
    if(!channel) {
      return response.status(404).send({ message: "Channel not found!" });
    }

    const messages = channel.messages;
    response.status(200).json({ messages });

  } catch (error) {
    console.error("Error in getUserChannels: ", error);
    return response.status(500).send({ message: "internal server error!" });
  }
};

export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    response.status(200).json({ channels });
  } catch (error) {
    console.error("Error in getUserChannels: ", error);
    return response.status(500).send({ message: "internal server error!" });
  }
};

