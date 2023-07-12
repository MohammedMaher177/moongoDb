import { Schema, Types, model } from "mongoose"

const awards = {
    wins: "",
    nominations: "",
    text: ""
}

const imdb = {
    rating: Number,
    votes: Number,
    id: Number
}



const moviesSchema = new Schema({
    plot: { type: String, require: true },
    genres: { type: [String], require: true },
    runtime: { type: Number, require: true },
    cast: { type: [String], require: true },
    num_mflix_comments: { type: Number, require: true },
    title: { type: String, require: true },
    fullplot: { type: String, require: true },
    countries: { type: [String], require: true },
    released: { type: Date, require: true },
    directors: { type: [String], require: true },
    rated: { type: String, require: true },
    awards: {  type: { wins: Number, nominations: Number, text: String },  require: true  },
    lastupdated: { type: String, require: true },
    year: { type: Number, require: true },
    imdb: {type:{rating: Number, votes: Number,  id: Number}, require:true},
    type: { type: String, require: true },
    tomatoes: {type :{viewer:{type:{rating:Number, numReviews:Number, meter:Number}},lastUpdated:Date}, require:true}
})


const moviesModel = model("movie", moviesSchema)

export default moviesModel;

