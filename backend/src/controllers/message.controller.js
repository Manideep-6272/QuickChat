import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getSocketIdForUser } from "../lib/socket.js";

export const getUsersForSideBar = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in fetching users",error.message);
        res.status(500).json({message:"internal server error"});
    }
};

export const getMessages = async (req,res)=>{
    try {
        const { id : userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId : userToChatId,receiverId:myId}
            ]
        }).sort({createdAt: 1});
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in reading msgs",error.message);
        res.status(500).json({message:"internal server error"});
    }
}


export const sendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const myId = req.user._id;
        let imageURL;
        
        if (image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageURL=uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId:myId,
            receiverId,
            text,
            image:imageURL
        })
        
        await newMessage.save();

        // Get sender details for the message
        const sender = await User.findById(myId).select("-password");

        // Prepare message data to send
        const messageData = {
            _id: newMessage._id,
            senderId: myId,
            receiverId,
            text,
            image: imageURL,
            createdAt: newMessage.createdAt,
            senderName: sender?.name,
            senderProfilePic: sender?.profilepic
        };

        // Emit message to receiver if they're online
        const receiverSocketId = getSocketIdForUser(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", messageData);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sending msgs",error.message);
        res.status(500).json({message:"internal server error"});
    }
}