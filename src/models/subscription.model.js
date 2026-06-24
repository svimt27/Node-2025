import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    // one who is subscribing
    subscriber:{
        type:mongoose.Schema.ObjectId,  
        ref:"User"
    },
    // one to whom 'subscriber' is subscribing
    channel:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{timestamps:true});



export const Subscription = mongoose.model('Subscription',subscriptionSchema)