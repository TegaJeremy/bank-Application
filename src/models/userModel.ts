import mongoose,{Document, Schema, Types} from "mongoose";

interface User {
    id:string,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    dateOfBirth:string,
    phoneNumber:string,
    address: string;
    otp:Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

}


const userSchema:Schema = new Schema<User & Document>({
    firstName:{type:String, required:true},
    lastName: {type:String, required:true},
    email: { type:String, required:true},
    password: { type:String, required:true},
    dateOfBirth: { type:String, required:true},
    phoneNumber: { type:String, required:true},
    address: { type:String, required:true},
    otp: { type: Schema.Types.ObjectId, ref: 'OTP', required: true },
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}
})


const UserModel = mongoose.model<User & Document>('User', userSchema);
export default UserModel

