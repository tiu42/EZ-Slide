import mongoose from "mongoose";

// 1 - Create User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String},// Password can be optional for OAuth users
  avatarUrl: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  provider: { type: String, enum: ["local", "google", "facebook"], default: "local" },
}, { timestamps: true });

// 2 - Create User Model
const User = mongoose.model("User", UserSchema);

export default User;