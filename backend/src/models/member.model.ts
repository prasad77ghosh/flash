import { Schema, model, Model } from "mongoose";
import { Member } from "../types/member";

const memberSchema = new Schema<Member, Model<Member>>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MemberSchema = model<Member, Model<Member>>("Member", memberSchema);

export default MemberSchema;
