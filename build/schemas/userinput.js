import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  empid: { required: true, type: String },
  name: { required: true, type: String },
  email: { required: true, type: String },
  department: { required: true, type: String },
  status: { required: true, type: String },
  team: { required: true, type: String },
  manager: { required: true, type: String },
  shift: { required: true, type: String },
  location: { required: true, type: String },
  date: { required: true, type: String },

});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

export const userInput = mongoose.model("UserInput", userSchema);
