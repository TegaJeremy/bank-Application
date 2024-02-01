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
    accountNumber:string,
    amount:number,
    isVerified:boolean;
  createdAt: Date;
  updatedAt: Date;

}


const userSchema:Schema = new Schema<User & Document>({
    firstName:{type:String, required:true},
    lastName: {type:String, required:true},
    email: { type:String, required:true},
    password: { type:String, required:true},
    dateOfBirth: { type:String, required:true},
    phoneNumber: { type:String, required:true, unique:true},
    address: { type:String, required:true},
    otp: { type: Schema.Types.ObjectId, ref: 'OTP', required: true },
    accountNumber: { type:String, required:true},
    amount:{ type:Number, default:0.000},
    isVerified:{type:Boolean, default:false},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}
})


const UserModel = mongoose.model<User & Document>('User', userSchema);
export default UserModel
