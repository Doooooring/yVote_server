import mongoose from "mongoose";

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    user: { type: String, required: true },
    news: { type: String, required: true },
    response: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

voteSchema.index({
  news: 1,
  response: 1,
});

voteSchema.index({
  user: 1,
  news: 1,
});

export const Vote = mongoose.model("Vote", voteSchema);
