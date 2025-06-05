import mongoose from "mongoose";

const groupchatSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        expiringAt: {
            type: Date
        }
    }, {timestamps: true}
);

const Groupchat = mongoose.model("Groupchat", groupchatSchema);

export default Groupchat;