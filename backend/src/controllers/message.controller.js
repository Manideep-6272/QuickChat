import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getusersForSideBar = async (req,res)=>{
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
        })
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

        //todo:real time message to be implemented

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sending msgs",error.message);
        res.status(500).json({message:"internal server error"});
    }
}