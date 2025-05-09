import User from "../models/user.models.js";
import Message from "../models/message.models.js";
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

export const getMessages = async(req, res) => {
    try {
       const {id: userToChatId } = req.params
       const myId = req.user._id;
       //this makes you the sender and the other end is receiver or vice versa
       const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId: userToChatId},
            {sendId: userToChatId, receiverId:myId}
        ]
       })
       //success
       res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}