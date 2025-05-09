import User from "../models/user.models.js";
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