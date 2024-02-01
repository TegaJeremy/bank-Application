import  TransactionModel from '../models/transistionModel'
import UserModel from '../models/userModel'
import {Request, Response} from "express"



const deposit = async (req: Request, res: Response) => {
    try {
      const { accountNumber, amount } = req.body;
  
      // Check if the amount is a positive number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount' });
      }
  
      // Find the user
      const user = await UserModel.findOne({ accountNumber });

      
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      //start a session
      const session = await TransactionModel.startSession();
      session.startTransaction();
  
      try {
        // Update user's amount (increment)
        await UserModel.findOneAndUpdate(
          { accountNumber },
          { $inc: { amount: amount } }
        );
  
        // Record the deposit transaction
        const depositTransaction = new TransactionModel({
          type: 'deposit',
          amount,
          accountNumber,
        });
        await depositTransaction.save();
  
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
  
        res.status(200).json({ message: 'Deposit successful', data: depositTransaction });
      } catch (error) {
        // Rollback in case of an error
        await session.abortTransaction();
        session.endSession();
  
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };


const Transfer = async (req:Request, res:Response)=>{
    try {
        const {senderAccountNumber, receiverAccountNumber, amount} = req.body
        // Check if both sender and receiver account numbers are provided
    if (!senderAccountNumber || !receiverAccountNumber) {
        return res.status(400).json({ message: 'Sender and receiver account numbers are required' });
      }
       // Check if the amount is a positive number
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid transfer amount' });
      }
        // Find the sender and receiver users
    const senderUser = await UserModel.findOne({ accountNumber: senderAccountNumber });
    const receiverUser = await UserModel.findOne({ accountNumber: receiverAccountNumber });

    // Check if sender and receiver users exist
    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }
     // Check if the sender has sufficient funds
     if (senderUser.amount < amount) {
        return res.status(400).json({ message: 'Insufficient funds for the transfer' });
      }

      //start a session
      const session = await TransactionModel.startSession()
      session.startTransaction()
      try {
        // Update sender's amount (decrement)
        await UserModel.findOneAndUpdate(
          { accountNumber: senderAccountNumber },
          { $inc: { amount: -amount } }
        );
  
        // Update receiver's amount (increment)
        await UserModel.findOneAndUpdate(
          { accountNumber: receiverAccountNumber },
          { $inc: { amount: amount } }
        );
  
        // Record the transfer transaction
        const transferTransaction = new TransactionModel({
          type: 'transfer',
          amount,
          accountNumber: senderAccountNumber,
        });
        await transferTransaction.save();
  
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
  
        res.status(200).json({ message: 'Transfer successful', data: transferTransaction });
      } catch (error) {
        // Rollback in case of an error
        await session.abortTransaction();
        session.endSession();
  
        console.error(error);
        res.status(500).json({ message: error.message });
      }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}


const withdraw = async (req: Request, res: Response) => {
    try {
      const { accountNumber, amount } = req.body;
  
      // Check if account number and amount are provided
      if (!accountNumber || !amount) {
        return res.status(400).json({ message: 'Account number and amount are required' });
      }
  
      // Check if the amount is a positive number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount' });
      }
  
      // Find the user by account number
      const user = await UserModel.findOne({ accountNumber });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user has sufficient funds
      if (user.amount < amount) {
        return res.status(400).json({ message: 'Insufficient funds for the withdrawal' });
      }
  
      // Start a session
      const session = await TransactionModel.startSession();
      session.startTransaction();
  
      try {
        // Update user's amount (decrement)
        await UserModel.findOneAndUpdate(
          { accountNumber },
          { $inc: { amount: -amount } }
        );
  
        // Record the withdrawal transaction
        const withdrawalTransaction = new TransactionModel({
          type: 'withdrawal',
          amount,
          accountNumber,
        });
        await withdrawalTransaction.save();
  
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
  
        res.status(200).json({ message: 'Withdrawal successful', data: withdrawalTransaction });
      } catch (error) {
        // Rollback in case of an error
        await session.abortTransaction();
        session.endSession();
  
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  const getTransactionHistory = async (req: Request, res: Response) => {
    try {
      const { accountNumber } = req.params;
  
      // Check if account number is provided
      if (!accountNumber) {
        return res.status(400).json({ message: 'Account number is required' });
      }
  
      // Find all transactions associated with the account number
      const transactions = await TransactionModel.find({ accountNumber });
  
      res.status(200).json({ data: transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  export default getTransactionHistory;
export {
    deposit,
    Transfer,
    withdraw,
    getTransactionHistory
}