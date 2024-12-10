import Message from "../modals/messageModal.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    if (!user1 || !user2) {
      return response
        .status(400)
        .send({ message: "Both user ids are required" });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          recipient: user2,
        },
        {
          sender: user2,
          recipient: user1,
        },
      ],
    }).sort({ timeStamp: 1 });

    return response.status(200).json({ messages });
  } catch (error) {
    return response.status(500).send({ message: "internal server error!" });
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    if(!request.file) return response.status(400).send("File is required!");
    const date = Date.now();
    let fileDir = "uploads/files/" + date
    let fileName = fileDir + "/" + request.file.originalname;

    mkdirSync(fileDir, { recursive: true });
    renameSync(request.file.path, fileName);

    return response.status(200).json({ filePath: fileName });
  } catch (error) {
    return response.status(500).send({ message: "internal server error!" });
  }
};
