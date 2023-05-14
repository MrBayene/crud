import { NextFunction, Response, Request } from "express";
import mongoose, { Mongoose } from "mongoose";
import Transaction from "../models/Transaction";
import Logger from "../common/Logger";
import fs from "fs";
import csvToJson from "csvtojson";
import { crossOriginResourcePolicy } from "helmet";

const update = (req: Request, res: Response, next: NextFunction) => {
  var transactions = [
    {
      RegisterDate: "4111-11-11,1111",
      TransactionDate: "1111-11-11,1112",
      Name: "test",
      Description: '"PLEASURE test"',
      Amount: "111",
      Balance: "11111",
    },
    {
      RegisterDate: "5111-11-11,1111",
      TransactionDate: "2111-11-11,1112",
      Name: "test2",
      Description: '"PLEASURE test2"',
      Amount: "211",
      Balance: "21111",
    },
    {
      RegisterDate: "6111-11-11,1111",
      TransactionDate: "3111-11-11,1112",
      Name: "test3",
      Description: '"PLEASURE test3"',
      Amount: "311",
      Balance: "31111",
    },
  ];
  Transaction.collection
    .insertMany(transactions, {
      ordered: false,
    })
    .then(function () {
      res.status(201).json({ message: "Data Inserted" }); // Success
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({ error });
    });
};
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
  transaction
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
  update,
};
