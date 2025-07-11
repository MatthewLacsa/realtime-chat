import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

//get the users to chat except yourself
export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        //get all the users except yourself - their password
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
};
//update this to also include group chat ids
export const getMessages = async(req, res) => {
    try {
       const {id: userToChatId } = req.params
       const myId = req.user._id;
       //this makes you the sender and the other end is receiver or vice versa
       const messages = await Message.find({
        $or:[
            {senderId: myId, receiverId: userToChatId},
            {senderId: userToChatId, receiverId: myId}
        ]
       })
       //success
       res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};
//update this to also include groupchat ids
export const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        //save the message
        await newMessage.save();


        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};