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
  },
  postComments: {
    type: [{
      user_id: { type: Types.ObjectId, required: true, ref: 'user' },
      content: String
    }],
    default: []
  },
  postLikes: {
    type: [{type: Types.ObjectId, ref: 'user',}],
    default: []
  }
});

const postsModel = mongoose.model('Post', postSchema);

export default postsModel