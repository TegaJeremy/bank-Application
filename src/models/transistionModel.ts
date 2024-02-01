import mongoose, { Document, Schema, Types } from 'mongoose';

interface Transaction {
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  accountNumber: string;
  createdAt: Date;
}

const transactionSchema: Schema = new Schema<Transaction & Document>(
  {
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    amount: { type: Number, required: true },
    accountNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true } }
);

const TransactionModel = mongoose.model<Transaction & Document>('Transaction', transactionSchema);
export default TransactionModel;

