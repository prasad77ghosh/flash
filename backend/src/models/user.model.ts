import { Schema, model, Model } from "mongoose";
import { User } from "../types/user";


// export
//   interface User {
//   _id: any;
//   name: string;
//   email: string;
//   password?: string;
//   avatar?: string;
//   isVerified:boolean,
//   createdAt: Date;
//   updatedAt: Date;
// }

const userSchema = new Schema<User, Model<User>>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = model<User, Model<User>>("User", userSchema);

export default UserSchema;
