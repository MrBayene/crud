import { NextFunction, Response, Request } from "express";
import mongoose, { Mongoose } from "mongoose";
import Transaction from "../models/Transaction";
import Logger from "../common/Logger";

const createTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { RegisterDate, TransactionDate, Name, Description, Amount, Balance } =
    req.body;
  const transaction = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    RegisterDate,
    TransactionDate,
    Name,
    Description,
    Amount,
    Balance,
  });

  return transaction
    .save()
    .then((transaction) => res.status(201).json({ transaction }))
    .catch((error) => res.status(500).json({ error }));
};

const readTransaction = (req: Request, res: Response, next: NextFunction) => {
  const transactionId = req.params.transactionId;
  return Transaction.findById(transactionId)
    .then((transaction) =>
      transaction
        ? res.status(200).json({ transaction })
        : res.status(404).json({ message: "Not found " })
    )
    .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
  return Transaction.find()
    .then((transactions) =>
      transactions
        ? res.status(200).json({ transactions })
        : res.status(404).json({ message: "Not found " })
    )
    .catch((error) => res.status(500).json({ error }));
};
const updateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const transactionId = req.params.transactionId;

  return Transaction.findById(transactionId)
    .then((transaction) => {
      if (transaction) {
        transaction.set(req.body);
        return transaction
          .save()
          .then((transaction) => res.status(201).json({ transaction }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: "Not found " });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
const deleteTransaction = (req: Request, res: Response, next: NextFunction) => {
  const transactionId = req.params.transactionId;
  return Transaction.findByIdAndDelete(transactionId).then((transaction) =>
    transaction
      ? res.status(201).json({ message: "deleted" })
      : res.status(404).json({ message: "Not found" })
  );
};

const getDupes = (req: Request, res: Response, next: NextFunction) => {
  const query = req.body;
  return Transaction.find(query)
    .then((transactions) =>
      transactions
        ? res.status(200).json({ transactions })
        : res.status(404).json({ message: "Not found " })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createTransaction,
  readTransaction,
  readAll,
  updateTransaction,
  deleteTransaction,
  getDupes,
};
