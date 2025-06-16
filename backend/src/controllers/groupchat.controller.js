import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import Groupchat from "../models/groupchat.models.js";

export const createGroupChat = async(req, res) => {
    const {groupName, members, expiringAt} = req.body;
    const owner = req.user._id;
    try {
        //will add members validity tmr
        if(!groupName || !owner || !members) {
            return res.status(400).json({message: "u need a group name"});
        }
        const newGroup = new Groupchat({
            groupName,
            owner,
            members,
            messages: [],
            expiringAt,
        });

        await newGroup.save();

    } catch (error) {
        console.log("Error in createGroupChat controller");
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const addUser = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}
export const removeUser = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}
export const getGroupDetails = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}
export const getGroupChats = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}

export const deleteGroupChat = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}

export const updateExpiryDate = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}
//create a group chat
//adding users to a group chat
//deleting users from a group chat
//get details of a group chat
//list all users' group chats
//delete group chat
//update expiry  
/*
seen functionality, notification, etc?
*/