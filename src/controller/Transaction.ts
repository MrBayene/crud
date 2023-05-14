import { NextFunction, Response, Request } from "express";
import mongoose, { Mongoose } from "mongoose";
import Transaction from "../models/Transaction";
import Logger from "../common/Logger";
import fs from "fs";
import csvToJson from "csvtojson";
import { crossOriginResourcePolicy } from "helmet";

type TransactionType = {
  RegisterDate: string;
  TransactionDate: string;
  Name: string;
  Description: string;
  Amount: string;
  Balance: string;
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const csvFilePath = "src/files/testTrans.csv";
  const json = await csvToJson().fromFile(csvFilePath);
  const transactions: TransactionType[] = [];
  json.forEach((jsonTrans) => {
    const {
      RegisterDate,
      TransactionDate,
      Name,
      Description,
      Amount,
      Balance,
    } = jsonTrans;
    transactions.push(jsonTrans);
  });

  const answer = Transaction.collection
    .insertMany(transactions, {
      ordered: false,
    })
    .then(function () {
      res.status(201).json({ message: answer }); // Success
    })
    .catch(function (error) {
      res.status(500).json({ error });
    })
    .finally(function () {
      // Copying the file to a the same name
      fs.copyFile(
        "src/files/testTrans.csv",
        "src/files/done/testTrans.csv",
        (err) => {
          if (err) {
            console.log("Error Found:", err);
          } else {
            fs.unlink("src/files/testTrans.csv", (err) => {
              if (err) {
                throw err;
              }

              console.log("Delete File successfully.");
            });
            console.log("DONE");
          }
        }
      );
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
