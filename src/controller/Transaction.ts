import { NextFunction, Response, Request } from "express";
import mongoose, { Mongoose } from "mongoose";
import Transaction from "../models/Transaction";
import CCategory from "../controller/Category";
import MCategory from "../models/Category";
//import {getCategory,setCategory}from "../controller/Category";
import Logger from "../common/Logger";
import fs from "fs";
import csvToJson from "csvtojson";
import { config } from "../config/config";

type TransactionType = {
  RegisterDate: string;
  TransactionDate: string;
  Name: string;
  Description: string;
  Amount: string;
  Balance: string;
  Category: string;
};
type Resolution = {
  success: string[];
  errors: TransError[];
  cats: string[];
};
type TransError = {
  description: string;
  inserted: string;
};

const updateDBwithFile = async (srcFile: string, res: Resolution) => {
  const csvFilePath = config.server.reportFolder + srcFile;
  const doneFilePath = config.server.doneFolder + srcFile;
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
    if (jsonTrans.Category) {
      CCategory.setCategory(
        jsonTrans.Name,
        jsonTrans.Description,
        jsonTrans.Category
      ).then((result) => {
        res.cats.push(result);
      });
    } else {
      const newCat = CCategory.getCategory(
        jsonTrans.Name,
        jsonTrans.Description
      );
      jsonTrans.Category = newCat;
    }

    transactions.push(jsonTrans);
  });

  return Transaction.collection
    .insertMany(transactions, {
      ordered: false,
    })
    .then((result) => {
      Object.entries(result.insertedIds).forEach(([key, value]) => {
        res.success.push(value.toString());
      });
    })
    .catch((error) => {
      res.errors.push(error);
    })
    .finally(function () {
      // Copying the file to a the same name
      fs.copyFile(csvFilePath, doneFilePath, (err) => {
        if (err) {
          console.log("Error Found:", err);
        } else {
          fs.unlink(csvFilePath, (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const resolution: Resolution = {
    success: [],
    errors: [],
    cats: [],
  };

  fs.readdir(config.server.reportFolder, (err, files: string[]) => {
    files.forEach((file: string) => {
      const answer = updateDBwithFile(file, resolution);
    });
  });
  //while (resolution.errors.length == 0 && resolution.success.length == 0) {
  await new Promise((f) => setTimeout(f, 1000));
  //}
  resolution.errors.length == 0
    ? res.status(201).json(resolution)
    : res.status(500).json(resolution);
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

const uncategorized = (req: Request, res: Response, next: NextFunction) => {
  //find uncategorized
  Transaction.find({ Category: null })
    .limit(10)
    .then((uncategorized) => {
      res.status(200).json(uncategorized);
      console.log(uncategorized);
    });

  //set category
};

const categorize = (req: Request, res: Response, next: NextFunction) => {
  Transaction.findByIdAndUpdate(
    "60679d148fe5ed3ce091bfa7",
    {
      Names: "Unionen1",
    },
    {
      new: true,
    }
  ).then((response) => res.status(200).json(response));
};

const createCategory = (req: Request, res: Response, next: NextFunction) => {
  const { Name, Description, Category } = req.body;
  res.status(503).json({ message: "Not Yet Implemented" });
};

export default {
  createCategory,
  createTransaction,
  readTransaction,
  readAll,
  updateTransaction,
  deleteTransaction,
  getDupes,
  update,
  uncategorized,
  categorize,
};
