import User from "../modals/userModal.js";
import Message from "../modals/messageModal.js";
import mongoose from "mongoose";

export const searchContact = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;
    if (!searchTerm || searchTerm === null || searchTerm === undefined) {
      return response.status(400).send({ message: "search term is required!" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    return response.status(500).send({ message: "internal server error!" });
  }
};

export const getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find({ _id: { $ne: request.userId } }, "firstName lastName email _id");

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }))
    
    return response.status(200).json({ contacts });
  } catch (error) {
    return response.status(500).send({ message: "internal server error!" });
  }
};

export const getContactsForDmList = async (request, response, next) => {
  try {
    const { userId } = request;
    console.log("Received userId:", userId);

    const objectId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: objectId }, { recipient: objectId }],
        },
      },
      {
        $sort: { timeStamp: -1 },
      },
      {
        $addFields: {
          otherParty: {
            $cond: { if: { $eq: ["$sender", objectId] }, then: "$recipient", else: "$sender" },
          },
        },
      },
      {
        $group: {
          _id: "$otherParty",
          lastMessageTime: { $max: "$timeStamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $match: {
          "contactInfo._id": { $ne: objectId }, // Exclude own account
        },
      },
      {
        $project: {
          _id: 1,
          id: "$contactInfo.id",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          email: "$contactInfo.email",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
          lastMessageTime: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    if (!contacts || contacts.length === 0) {
      // console.log("No matching messages found for userId:", userId);
      return response.status(404).send({ message: "No contacts found for this user." });
    }

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Aggregation error:", error);
    return response.status(500).send({
      message: "Internal server error!",
      error: error.message,
    });
  }
};
