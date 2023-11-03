import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  addproject: { required: true, type: String },


});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

export const pmInput = mongoose.model("PmInput", userSchema);
