import {Conversation} from "../models/conversation.model.js";
import {Message} from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
//for chating
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { text:message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    //establish a new conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
 
    //implment socket.io for real-time notifactions

    const receiverSocketId= getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',newMessage)
    }

    return res.status(200).json({ newMessage, success: true });
  } catch (error) {
    console.log(error)
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderID=req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({  
      participants: { $all: [senderID, receiverId] },
    }).populate('messages');

    if(!conversation){
      return res.status(200).json({ messages:[], success: true });
    }
    return res.status(200).json({ success: true ,messages:conversation?.messages});
    
  } catch (error) {
    console.log(error)
  }
};
