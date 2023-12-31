import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  empid: { required: true, type: String },
  name: { required: true, type: String },
  email: { required: true, type: String },
  password: { required: true, type: String },
  profile_image: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

export const userModel = mongoose.model("User", userSchema);
