import { Schema, model } from "mongoose"


const theatersSchema = new Schema({
    theaterId: { type: Number, require: true },
    location: { type: Schema.Types.Mixed, require: true }
})


const theatersModel = model("theater", theatersSchema)

export default theatersModel;