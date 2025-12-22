import mongoose from "mongoose";
import bcrypt from "bcryptjs"

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

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPw){
  return await bcrypt.compare(enteredPw, this.password)
}

// 2 - Create User Model
const User = mongoose.model("User", UserSchema);

export default User;