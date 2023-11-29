import { Schema, model, models } from "mongoose";

const postSchema = new Schema({
  author: String,
  text: String,
  image: String,
  startDate: String,
  endtDate: String,
  isOver: Boolean,
  isParticipantCountPublic: Boolean,
  yesCount: Number,
  noCount: Number, 
});

const Post = models.Post || model('Post', postSchema);

export default Post;