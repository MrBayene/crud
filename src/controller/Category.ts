import mongoose, { Mongoose } from "mongoose";
import MCategory from "../models/Category";

type CategoryType = {
  Name: string;
  Description: string;
  Category: string;
};

const getCategory = (description: string, name: string) => {
  return MCategory.find({ Description: description, Name: name });
};

const setCategory = async (
  description: string,
  name: string,
  category: string
) => {
  const newCategory = new MCategory({
    _id: new mongoose.Types.ObjectId(),
    Name: name,
    Description: description,
    Category: category,
  });
  const catAsString = name + " + " + description + " => " + category;
  let result: string =
    catAsString +
    " : ERROR - If you are seeing this then I dont know if the category was created or it existed already.";
  console.log("before save");
  await newCategory
    .save()
    .then(() => {
      console.log(" THEN");
      result = "( " + catAsString + " ) has been added.";
    })
    .catch((error) => {
      console.log("CATCH");
      if (JSON.stringify(error).search("E1100")) {
        console.log("DUPLI");
        result = "( " + catAsString + " ) already exists.";
      } else {
        throw error;
      }
    });
  console.log(result);
  return result;
};

export default {
  getCategory,
  setCategory,
};
