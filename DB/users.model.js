
import { Schema, Types, model } from "mongoose"


const usersSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    age: Number,
    phone: String,
    gender: { type: String, enum: ['Male', 'Female', 'Not Selected'] },
    confirmEmail: { type: Boolean, default: false },
    firends: {
        type: [{ type: Types.ObjectId, ref: 'user', }],
        default: []
    },
    firendRequest: {
        type: [{ type: Types.ObjectId, ref: 'user', }],
        default: []
    }
}, { timestamps: true })

const usersModel = model("user", usersSchema)


export default usersModel;