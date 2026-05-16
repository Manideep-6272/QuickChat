import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
