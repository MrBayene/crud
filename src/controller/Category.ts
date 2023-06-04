import mongoose, { Mongoose } from "mongoose";
import MCategory from "../models/Category";

type CategoryType = {
  Name: string;
  Description: string;
  Category: string;
};
export type CategoryResult = {
  category: string;
  message: string;
};

export const getCategory = async (description: string, name: string) => {
  const foundCategory: CategoryResult = {
    category: "N/A",
    message: "N/A",
  };
  await MCategory.find({ Description: description, Name: name }).then(
    (result) => {
      console.log;
      if (result.length > 0) {
        foundCategory.category = (
          result as unknown as CategoryType[]
        )[0].Category;
        foundCategory.message =
          "Category " + foundCategory.category + " has been used";
      } else {
        foundCategory.message = "No Matching Category was found ";
      }
    }
  );
  return foundCategory;
};

export const setCategory = async (
  name: string,
  description: string,
  category: string
) => {
  const newCategory = new MCategory({
    _id: new mongoose.Types.ObjectId(),
    Name: name,
    Description: description,
    Category: category,
  });
  const result: CategoryResult = {
    category: "N/A",
    message: "N/A",
  };
  const catAsString = name + " + " + description + " => " + category;
  await newCategory
    .save()
    .then(() => {
      result.category = category;
      result.message = "( " + catAsString + " ) has been added.";
    })
    .catch((error) => {
      if (JSON.stringify(error).search("E1100")) {
        result.message = "( " + catAsString + " ) already exists.";
      } else {
        throw error;
      }
    });
  return result;
};

export default {
  getCategory,
  setCategory,
};
