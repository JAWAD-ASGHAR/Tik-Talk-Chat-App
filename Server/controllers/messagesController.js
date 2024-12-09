import Message from "../modals/messageModal.js";

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
