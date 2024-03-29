import userModel from '../models/userModel'
import otpModel from '../models/otpVerificationModel'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import otpgenerator from 'otp-generator'
import sendEmail from '../middlewares/mail'
import sendMail from '../helpers/mailTemplates'


const registerUser = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password, address, phoneNumber, dateOfBirth,accountNumber } = req.body;
    //   const checkemail = await userModel.findOne({ email });
  
    //   if (checkemail) {
    //     return res.status(404).json({ message: 'User email already registered' });
    //   }
  
      // Extract the last 10 digits of the phone number as the account number
      const digits = phoneNumber.slice(-10);
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      // Generate a random OTP
      const OTP = otpgenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      }).replace(/\D/g, ''); // Remove non-digit characters from the generated OTP
  
      const hashedOTP = await hashOTP(OTP);
  
      // Create a new OTP instance
      const userotp = new otpModel({
        otp: hashedOTP,
      });
  
      // Save the OTP
      const savedOtp = await userotp.save();
  
      // Create a new user instance with the associated OTP
      const user = new userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        phoneNumber,
        dateOfBirth,
        otp: savedOtp._id, // Set the user's otp field with the saved OTP _id
        accountNumber:digits
      });
     
  
      // Save the user
      await user.save();
  
      // Create a JWT token
      const token = jwt.sign({ email: user.email }, process.env.secretKey, { expiresIn: '15m' });
  
      // Prepare and send a verification email
      const subject = 'New User Registration';
      let html: string;
  
      html = sendMail(OTP);
      const data = {
        email: user.email,
        subject,
        html,
      };
      await sendEmail(data);
  
      res.status(200).json({ message: 'Signed up successfully', data: user, token,accountNumber });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const hashOTP = async (otp:string) =>{
    const salt = await bcrypt.genSalt(10)
    const hashedotp = await bcrypt.hashSync(otp,salt)
    return hashedotp
}

const verifyEmail = async (req:Request, res:Response)=>{
    try {
        const {token} = req.params
        const {otp} = req.body

        if(!token){
            return res.status(404).json({message:'Token not found'}) }
            if(!otp){
                return res.status(404).json({message:'otp cannot be empty'})
            }
            const {email} = jwt.verify(token, process.env.secretKey) as {email:string}
            const user = await userModel.findOne({email})
            if (!user){
                return res.status(404).json({message:'user not found'})
            }

            if(user.isVerified){
                return res.status(400).json({message:'user alreaady verified'})
            }
           // Retrieve the reference to the OTP document
        const otpReference = user.otp;
        console.log(otpReference)

        // Retrieve the actual OTP document
        const latestOtp = await otpModel.findById(otpReference);
        // const find =latestOtp.otp
        // console.log(find)
            if(!latestOtp){
                return res.status(404).json({message:'otp not found'})
            }
            const validOtp = await bcrypt.compare(otp, latestOtp.otp)
            if(!validOtp){
                return res.status(400).json({message:'otp does not match'})
            }
             user.isVerified = true
             await user.save()

             await otpModel.deleteOne({ _id: latestOtp._id }); // Delete the used OTP
             res.status(200).json({message:'user verified successfuly'})
    } catch (error) {
    res.status(500).json(error.message)
    }
}

const resendVerification = async (req:Request, res:Response)=>{
    try {
        const {email} = req.body

        const user = await userModel.findOne({email})
        if(!user){
            res.status(404).json({message:'user not found'})
        }
        if(user.isVerified){
            res.status(400).json({message:'user already verified'})
        }
            
      // Generate a random OTP
      const OTP = otpgenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      }).replace(/\D/g, ''); // Remove non-digit characters from the generated OTP
  
      const hashedOTP = await hashOTP(OTP);
  
      // Create a new OTP instance
      const userotp = new otpModel({
        otp: hashedOTP,
      });
  
      // Save the OTP
      const savedOtp = await userotp.save();

        // Create a JWT token
        const token = jwt.sign({ email: user.email }, process.env.secretKey, { expiresIn: '15m' });
  
        // Prepare and send a verification email
        const subject = 'resend verification';
        let html: string;
    
        html = sendMail(OTP);
        const data = {
          email: user.email,
          subject,
          html,
        };
        await sendEmail(data);
    
        res.status(200).json({ message: 'otp resent successfully', data: user, token,});

    } catch (error) {
       res.status(500).json(error.message) 
    }
}

export {
    registerUser,
    verifyEmail,
    resendVerification
}