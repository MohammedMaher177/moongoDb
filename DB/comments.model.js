import { Schema, Types, model } from "mongoose";



const commentsShema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    movie_id: { type: Types.ObjectId, ref: "movie" },
    text: { type: String, require: true },
    date: { type: Date, default: Date.now }
})



const commentsModel = model("comment", commentsShema);


export default commentsModel;