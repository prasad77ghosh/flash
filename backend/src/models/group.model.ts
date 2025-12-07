import { Schema, model, Model } from "mongoose";
import { Group } from "../types/group";

const groupSchema = new Schema<Group, Model<Group>>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    isPrivate: {
      type: Boolean,
      default: false,
      index: true,
    },

    profile: {
      type: String,
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
groupSchema.index({ name: "text", description: "text" });

const GroupSchema = model<Group, Model<Group>>("Group", groupSchema);

export default GroupSchema;
