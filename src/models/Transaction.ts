import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction {
  Description: string;
}

export interface ITransactionModel extends ITransaction, Document {}

const TransactionSchema: Schema = new Schema(
  {
    RegisterDate: { type: String, require: true },
    TransactionDate: { type: String, require: true },
    Name: { type: String, require: true },
    Description: { type: String, require: true },
    Amount: { type: String, require: true },
    Balance: { type: String, require: true },
    Category: { type: String, require: true },
  },
  {
    versionKey: false,
    collection: "Transactions",
  }
);
TransactionSchema.index(
  {
    RegisterDate: 1,
    TransactionDate: 1,
    Name: 1,
    Description: 1,
    Amount: 1,
    Balance: 1,
  },
  { unique: true }
);

export default mongoose.model<ITransactionModel>(
  "Transactions",
  TransactionSchema
);
