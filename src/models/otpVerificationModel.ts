
import { Document, Schema, model , Types} from 'mongoose';

interface OTP {
  userId: Types.ObjectId; // Reference to the user ID
  otp: string;
   createdAt:Date
}

const otpSchema = new Schema<OTP & Document>({
  userId: { type:Schema.Types.ObjectId, 
    ref: 'User' }, // Assuming 'User' is the model name for your user

  otp: { type: String, required: true },
     //after 5 minutes this will bw deleted authomatically from the database
   createdAt:{type:Date, default:Date.now,
     index:{expires:"300s"}}
});

const OTPModel = model<OTP & Document>('OTP', otpSchema);

export default OTPModel;
