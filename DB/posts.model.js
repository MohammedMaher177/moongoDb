import mongoose, { Schema, Types, model } from 'mongoose'



const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postsModel = mongoose.model('Post', postSchema);

export default postsModel