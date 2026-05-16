import mongoose from "mongoose";
import { CREDIT_GRANT_VERSION, INITIAL_FREE_CREDITS } from "../utils/credits.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    credits:{
        type:Number,
        default:INITIAL_FREE_CREDITS,
        min:0
    },
    creditGrantVersion:{
        type:Number,
        default:CREDIT_GRANT_VERSION
    },
    isCreditAvailable:{
        type:Boolean,
        default:true
    },
    notes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Notes",
        default:[]

    }

},{timestamps:true})

const UserModel = mongoose.model("UserModel" , userSchema)

export default UserModel
