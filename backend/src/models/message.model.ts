import { Schema, model, Model, Types } from "mongoose";
import { Message } from "../types/message";

const messageSchema = new Schema<Message, Model<Message>>(
  {
    type: {
      type: String,
      enum: ["TEXT", "POLL", "IMAGE", "VIDEO", "CODE", "AUDIO", "RICH_TEXT"],
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    deliverStatus: {
      type: String,
      enum: ["NOT_SEND", "SEND", "SEEN"],
      default: "NOT_SEND",
    },

    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageSchema = model<Message, Model<Message>>("Message", messageSchema);

export default MessageSchema;
