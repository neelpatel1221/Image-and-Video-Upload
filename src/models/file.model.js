import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
});

export const File = mongoose.model("File", fileSchema);
