
import { Schema, model } from "mongoose"


const usersSchema = new Schema({
    name:{ type:String, require:true },
    email: {type: String, require: true, unique: true},
    password: {type:String, require:true},
    age:Number,
    gender:{ type: String, enum:['Male', 'Female', 'Not Selected'] },
    confirmEmail:{ type: Boolean, default: false } 
},{ timestamps: true })

const usersModel = model("user", usersSchema)


export default usersModel;