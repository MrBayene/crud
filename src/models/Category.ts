import mongoose, { Document, Schema } from "mongoose";

export interface ICategory {
  Description: string;
}

export interface ICategoryModel extends ICategory, Document {}

const CategorySchema: Schema = new Schema(
  {
    Name: { type: String, require: true },
    Description: { type: String, require: true },
    Category: { type: String, require: true },
  },
  {
    versionKey: false,
    collection: "Categories",
  }
);
CategorySchema.index(
  {
    Name: 1,
    Description: 1,
  },
  { unique: true }
);

export default mongoose.model<ICategoryModel>("Categories", CategorySchema);
